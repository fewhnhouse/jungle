import { DragDropContext, DropResult } from 'react-beautiful-dnd'
import styled from 'styled-components'
import { useRouter } from 'next/router'
import Sprint from '../../../../components/backlog/Sprint'
import { useQuery, queryCache } from 'react-query'
import SprintCreation from '../../../../components/backlog/SprintCreationModal'
import UserstoryCreation from '../../../../components/backlog/UserstoryCreation'
import {
    UserStory,
    getUserstories,
    updateUserstory,
} from '../../../../taiga-api/userstories'
import { getMilestones, Milestone } from '../../../../taiga-api/milestones'
import { PageBody, PageHeader } from '../../../../components/Layout'
import PageTitle from '../../../../components/PageTitle'
import IssueList from '../../../../components/dnd/List'
import IssueCreation from '../../../../components/backlog/IssueCreation'
import { getTasks, Task, updateTask } from '../../../../taiga-api/tasks'
import { Empty, Skeleton } from 'antd'
import { getProject } from '../../../../taiga-api/projects'
import { Fragment } from 'react'

const IssueContainer = styled.div`
    display: flex;
    flex-direction: row-reverse;
    justify-content: space-between;
    flex-wrap: wrap;
    align-items: flex-start;
    @media (max-width: 800px) {
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
`

const Container = styled.div`
    flex: 1;
    min-width: 300px;
    width: 100%;
    max-width: 500px;
    margin: ${({ theme }) => theme.spacing.small};
    padding: ${({ theme }) => theme.spacing.mini};
`

const TitleContainer = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-between;
`

const ListContainer = styled.div`
    margin-top: ${({ theme }) => theme.spacing.medium};
`

const Title = styled.h2`
    margin: 0;
`

export default function Backlog() {
    const { projectId } = useRouter().query
    const { data: project } = useQuery(
        ['project', { projectId }],
        (key, { projectId }) => getProject(projectId as string),
        { enabled: projectId }
    )

    const { data: backlogData = [], isLoading: isBacklogLoading } = useQuery(
        ['backlog', { projectId }],
        async (key, { projectId }) => {
            const userstories = await getUserstories({
                projectId,
                milestoneIsNull: true,
            })
            const tasks = await getTasks({
                projectId,
            })
            return [
                ...userstories.filter((story) => !story.is_closed),
                ...tasks.filter(
                    (task) =>
                        task.user_story === null &&
                        task.milestone === null &&
                        !task.is_closed
                ),
            ]
        }
    )
    const { data: sprintsData = [], isLoading: isSprintsLoading } = useQuery(
        ['milestones', { projectId }],
        async (key, { projectId }) => {
            return getMilestones({
                closed: false,
                projectId: projectId as string,
            })
        },
        { enabled: projectId }
    )

    function onDragStart() {
        // Add a little vibration if the browser supports it.
        // Add's a nice little physical feedback
        if (window.navigator.vibrate) {
            window.navigator.vibrate(100)
        }
    }

    async function onDragEnd({ source, destination, draggableId }: DropResult) {
        // dropped outside the list
        if (!destination) {
            return
        }

        const isStory = draggableId.includes('story')
        const actualDraggableId = draggableId.split('-')[1]

        if (
            source.droppableId === destination.droppableId &&
            destination.index === source.index
        ) {
            return
        }

        const tasks = await getTasks({
            projectId: projectId.toString(),
            milestone:
                source.droppableId === 'backlog' ? null : source.droppableId,
        })

        const currentSprint = sprintsData.find(
            (sprint) => sprint.id.toString() === source.droppableId
        )

        const currentIssue = (source.droppableId === 'backlog'
            ? backlogData
            : isStory
            ? currentSprint.user_stories
            : tasks
        ).find((issue) => issue.id.toString() === actualDraggableId)
        queryCache.setQueryData(
            ['backlog', { projectId }],
            (prevData: (UserStory | Task)[]) => {
                if (source.droppableId === destination.droppableId) {
                    return prevData
                }
                if (source.droppableId === 'backlog') {
                    return prevData.filter((issue) => {
                        const isTask = (issue as Task).user_story !== undefined
                        if (isStory) {
                            return (
                                isTask ||
                                issue.id.toString() !== actualDraggableId
                            )
                        } else {
                            return (
                                !isTask ||
                                issue.id.toString() !== actualDraggableId
                            )
                        }
                    })
                } else if (destination.droppableId === 'backlog') {
                    return [...prevData, currentIssue]
                }
                return prevData
            }
        )
        if (isStory) {
            queryCache.setQueryData(
                ['milestones', { projectId }],
                (prevData: Milestone[]) => {
                    if (source.droppableId === destination.droppableId) {
                        return prevData
                    }
                    return prevData.map((milestone) => {
                        if (milestone.id.toString() === source.droppableId) {
                            return {
                                ...milestone,
                                user_stories: milestone.user_stories.filter(
                                    (story) => story.id !== currentIssue.id
                                ),
                            }
                        } else if (
                            milestone.id.toString() === destination.droppableId
                        ) {
                            return {
                                ...milestone,
                                user_stories: [
                                    ...milestone.user_stories,
                                    currentIssue,
                                ],
                            }
                        }
                        return milestone
                    })
                }
            )
        }

        const milestone =
            destination.droppableId === 'backlog'
                ? null
                : parseInt(destination.droppableId, 10)
        const order = destination.index
        const { id: issueId, version } = currentIssue
        if (isStory) {
            await updateUserstory(issueId, {
                milestone,
                sprint_order: order,
                version,
            })
        } else {
            await updateTask(issueId, { milestone, version })
        }
        queryCache.invalidateQueries(['backlog', { projectId }])
        if (isStory) {
            queryCache.invalidateQueries(['milestones', { projectId }])
        } else {
            queryCache.invalidateQueries(['tasks', { projectId, milestone }])
            queryCache.invalidateQueries([
                'tasks',
                {
                    projectId,
                    milestone: parseInt(source.droppableId, 10),
                },
            ])
        }
    }

    return (
        <div>
            <PageHeader>
                <PageTitle
                    breadcrumbs={[
                        { href: `/projects`, label: 'Projects' },
                        {
                            href: `/projects/${projectId}`,
                            label: project?.name,
                        },
                        {
                            href: `/projects/${projectId}/backlog`,
                            label: 'Backlog',
                        },
                    ]}
                    title="Backlog"
                    description="Adjust your backlog and your current sprints"
                />
            </PageHeader>
            <PageBody>
                <IssueContainer>
                    <DragDropContext
                        onDragStart={onDragStart}
                        onDragEnd={onDragEnd}
                    >
                        <Container>
                            <TitleContainer>
                                <Title>Sprints</Title>
                                <SprintCreation />
                            </TitleContainer>
                            <ListContainer>
                                <Skeleton active loading={isSprintsLoading}>
                                    {sprintsData?.length &&
                                        sprintsData
                                            .filter((sprint) => !sprint.closed)
                                            .map((sprint) => (
                                                <Fragment key={sprint.id}>
                                                    <Sprint
                                                        key={sprint.id}
                                                        sprint={sprint}
                                                    />
                                                    <IssueCreation
                                                        milestone={sprint.id}
                                                    />
                                                </Fragment>
                                            ))}
                                    {sprintsData?.length === 0 && (
                                        <Empty description="No Sprints exist for this Project. Create one to get started!" />
                                    )}
                                </Skeleton>
                            </ListContainer>
                        </Container>
                        <Container>
                            <TitleContainer>
                                <Title>Backlog</Title>
                                <UserstoryCreation />
                            </TitleContainer>
                            <ListContainer>
                                {isBacklogLoading ? (
                                    <Skeleton active />
                                ) : (
                                    <>
                                        <IssueList
                                            listId="backlog"
                                            issues={backlogData ?? []}
                                        />
                                        <IssueCreation milestone={null} />
                                    </>
                                )}
                            </ListContainer>
                        </Container>
                    </DragDropContext>
                </IssueContainer>
            </PageBody>
        </div>
    )
}
