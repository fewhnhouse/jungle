import { DragDropContext, DropResult } from 'react-beautiful-dnd'
import styled from 'styled-components'
import { useRouter } from 'next/router'
import Sprint from '../../../../components/backlog/Sprint'
import { useQuery, queryCache, QueryCache } from 'react-query'
import SprintCreation from '../../../../components/backlog/SprintCreationModal'
import IssueCreationModal from '../../../../components/backlog/IssueCreationModal'
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
import { getProject, getProjects } from '../../../../taiga-api/projects'
import { Fragment } from 'react'
import Head from 'next/head'
import { dehydrate } from 'react-query/hydration'
import { GetStaticProps } from 'next'

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

export async function getStaticPaths() {
    const projects = await getProjects()
    return {
        paths: projects
            .filter((project) => !project.is_private)
            .map((project) => ({
                params: { projectId: project.id.toString() },
            })),
        fallback: true,
    }
}

export const getStaticProps: GetStaticProps = async (context) => {
    const queryCache = new QueryCache()

    const projectId = context.params.projectId as string

    await queryCache.prefetchQuery(
        ['project', { projectId }],
        (key, { projectId }) => getProject(projectId)
    )

    await queryCache.prefetchQuery(
        ['milestones', { projectId }],
        (key, { projectId }) =>
            getMilestones({
                closed: false,
                projectId: projectId,
            })
    )

    await queryCache.prefetchQuery(
        ['tasks', { projectId }],
        (key, { projectId }) => getTasks({ projectId })
    )

    await queryCache.prefetchQuery(
        ['userstories', { projectId }],
        (key, { projectId }) => getUserstories({ projectId })
    )

    return {
        props: {
            dehydratedState: dehydrate(queryCache),
        },
        revalidate: 10,
    }
}

export default function Backlog() {
    const { projectId } = useRouter().query
    const { data: project } = useQuery(
        ['project', { projectId }],
        (key, { projectId }) => getProject(projectId as string),
        { enabled: projectId }
    )

    const { data: tasks, isLoading: isTasksLoading } = useQuery(
        ['tasks', { projectId }],
        (key, { projectId }) => getTasks({ projectId }),
        { enabled: projectId }
    )

    const { data: userstories, isLoading: isStoriesLoading } = useQuery(
        ['userstories', { projectId }],
        (key, { projectId }) => getUserstories({ projectId }),
        { enabled: projectId }
    )

    const isBacklogLoading = isTasksLoading && isStoriesLoading

    const { data: milestones = [], isLoading: isMilestonesLoading } = useQuery(
        ['milestones', { projectId }],
        async (key, { projectId }) => {
            return getMilestones({
                closed: false,
                projectId: projectId as string,
            })
        }
    )

    const backlogData = [
        ...userstories?.filter((story) => story.milestone === null),
        ...tasks?.filter((task) => task.milestone === null),
    ]

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

        const issues: (UserStory | Task)[] = isStory ? userstories : tasks

        const currentIssue = issues.find(
            (issue: Task | UserStory) =>
                issue.id.toString() === actualDraggableId
        )

        const destinationId =
            destination.droppableId === 'backlog'
                ? null
                : destination.droppableId

        if (isStory) {
            queryCache.setQueryData(
                ['userstories', { projectId }],
                (prevData: UserStory[]) =>
                    prevData.map((userstory) =>
                        userstory.id.toString() === actualDraggableId
                            ? { ...userstory, milestone: destinationId }
                            : userstory
                    )
            )
        } else {
            queryCache.setQueryData(
                ['tasks', { projectId }],
                (prevData: Task[]) =>
                    prevData.map((userstory) =>
                        userstory.id.toString() === actualDraggableId
                            ? { ...userstory, milestone: destinationId }
                            : userstory
                    )
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
        if (isStory) {
            queryCache.invalidateQueries(['userstories', { projectId }])
        } else {
            queryCache.invalidateQueries(['tasks', { projectId }])
        }
    }

    return (
        <div>
            <Head>
                <title>Backlog: {project?.name}</title>
                <meta
                    name="viewport"
                    content="initial-scale=1.0, width=device-width"
                />
            </Head>
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
                                <Skeleton active loading={isMilestonesLoading}>
                                    {milestones?.length &&
                                        milestones
                                            .filter((sprint) => !sprint.closed)
                                            .map((sprint) => (
                                                <Fragment key={sprint.id}>
                                                    <Sprint
                                                        userstories={
                                                            userstories
                                                        }
                                                        tasks={tasks}
                                                        isLoading={
                                                            isMilestonesLoading &&
                                                            isStoriesLoading &&
                                                            isTasksLoading
                                                        }
                                                        key={sprint.id}
                                                        sprint={sprint}
                                                    />
                                                    <IssueCreation
                                                        milestone={sprint.id}
                                                    />
                                                </Fragment>
                                            ))}
                                    {milestones?.length === 0 && (
                                        <Empty description="No Sprints exist for this Project. Create one to get started!" />
                                    )}
                                </Skeleton>
                            </ListContainer>
                        </Container>
                        <Container>
                            <TitleContainer>
                                <Title>Backlog</Title>
                                <IssueCreationModal />
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
