import { DragDropContext, DropResult } from 'react-beautiful-dnd'
import styled from 'styled-components'
import { useRouter } from 'next/router'
import Sprint from '../../../../components/backlog/Sprint'
import { useQuery, queryCache } from 'react-query'
import SprintCreation from '../../../../components/backlog/SprintCreation'
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
import { getTasks } from '../../../../taiga-api/tasks'
import { Empty } from 'antd'

const IssueContainer = styled.div`
    flex: 2;
    display: flex;
    flex-direction: row-reverse;
    flex-wrap: wrap;
`

const ContentContainer = styled.div`
    display: flex;
    max-width: 1000px;
    margin: auto;
`

const Container = styled.div`
    flex: 1;
    min-width: 300px;
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

    const { data: backlogData = [] } = useQuery(
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
                ...userstories,
                ...tasks.filter(
                    (task) =>
                        task.user_story === null && task.milestone === null
                ),
            ]
        }
    )
    const { data: sprintsData = [] } = useQuery(
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

    function onDragEnd({ source, destination, draggableId }: DropResult) {
        // dropped outside the list
        if (!destination) {
            return
        }
        if (
            source.droppableId === destination.droppableId &&
            destination.index === source.index
        ) {
            return
        }

        const currentSprint = sprintsData.find(
            (sprint) => sprint.id.toString() === source.droppableId
        )

        const currentStory = (source.droppableId === 'backlog'
            ? backlogData
            : currentSprint.user_stories
        ).find((story) => story.id.toString() === draggableId)

        queryCache.setQueryData(
            ['backlog', { projectId }],
            (prevData: UserStory[]) => {
                if (source.droppableId === destination.droppableId) {
                    return prevData
                }
                if (source.droppableId === 'backlog') {
                    return prevData.filter(
                        (story) => story.id !== currentStory.id
                    )
                } else if (destination.droppableId === 'backlog') {
                    return [...prevData, currentStory]
                }
                return prevData
            }
        )
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
                                (story) => story.id !== currentStory.id
                            ),
                        }
                    } else if (
                        milestone.id.toString() === destination.droppableId
                    ) {
                        return {
                            ...milestone,
                            user_stories: [
                                ...milestone.user_stories,
                                currentStory,
                            ],
                        }
                    }
                    return milestone
                })
            }
        )
        const milestone =
            destination.droppableId === 'backlog'
                ? null
                : parseInt(destination.droppableId, 10)
        const { id: storyId, version } = currentStory
        const order = destination.index
        updateUserstory(storyId, {
            milestone,
            sprint_order: order,
            version,
        }).then(() => {
            queryCache.invalidateQueries(['backlog', { projectId }])
            queryCache.invalidateQueries(['milestones', { projectId }])
        })
    }

    return (
        <>
            <PageHeader>
                <PageTitle
                    title="Backlog"
                    description="Adjust your backlog and your current sprints"
                />
            </PageHeader>
            <PageBody>
                <ContentContainer>
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
                                    {sprintsData?.length ? (
                                        sprintsData.map((sprint) => (
                                            <>
                                                <Sprint
                                                    key={sprint.id}
                                                    sprint={sprint}
                                                />
                                                <IssueCreation
                                                    milestone={sprint.id}
                                                />
                                            </>
                                        ))
                                    ) : (
                                        <Empty description="No Sprints exist for this Project. Create one to get started!" />
                                    )}
                                </ListContainer>
                            </Container>
                            <Container>
                                <TitleContainer>
                                    <Title>Backlog</Title>
                                    <UserstoryCreation />
                                </TitleContainer>
                                <ListContainer>
                                    {backlogData?.length ? (
                                        <>
                                            <IssueList
                                                listId="backlog"
                                                issues={backlogData ?? []}
                                            />
                                            <IssueCreation milestone={null} />
                                        </>
                                    ) : (
                                        <Empty description="The backlog is empty. Create a userstory to get started!" />
                                    )}
                                </ListContainer>
                            </Container>
                        </DragDropContext>
                    </IssueContainer>
                </ContentContainer>
            </PageBody>
        </>
    )
}
