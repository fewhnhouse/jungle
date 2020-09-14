import { DragDropContext, DropResult } from 'react-beautiful-dnd'
import IssueList from '../../../../components/backlog/UserstoryList'
import styled from 'styled-components'
import useMedia from 'use-media'
import { useRouter } from 'next/router'
import Sprint from '../../../../components/backlog/Sprint'
import { useQuery, queryCache } from 'react-query'
import SprintCreation from '../../../../components/backlog/SprintCreation'
import UserstoryCreation from '../../../../components/backlog/UserstoryCreation'
import {
    UserStory,
    getUserstories,
    updateUserstory,
} from '../../../../api/userstories'
import { getMilestones, Milestone } from '../../../../api/milestones'

const IssueContainer = styled.div`
    flex: 2;
    display: flex;
    flex-direction: row-reverse;

    @media screen and(max-width: 400px) {
        flex-direction: column;
    }
`

const ContentContainer = styled.div`
    display: flex;
`

const Sidebar = styled.aside`
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.25);
    border-radius: 8px;
    margin: 20px;
    flex: 1;
`

const Container = styled.div`
    flex: 1;
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

const Title = styled.h3`
    margin: 0;
`

export default function Backlog() {
    const { projectId } = useRouter().query

    const { data: backlogData = [] } = useQuery(
        ['backlog', { projectId }],
        async (key, { projectId }) => {
            return getUserstories({
                projectId: parseInt(projectId as string, 10),
                milestoneIsNull: true,
            })
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
        if (destination.index === source.index) {
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
            }
        )
        queryCache.setQueryData(
            ['milestones', { projectId }],
            (prevData: Milestone[]) => {
                if (source.droppableId === destination.droppableId) {
                    return prevData
                }
                if (destination.droppableId === 'backlog') {
                    const sourceMilestone = prevData.find(
                        (milestone) =>
                            milestone.id.toString() === source.droppableId
                    )
                    const unaffectedMilestones = prevData.filter(
                        (milestone) =>
                            milestone.id.toString() !==
                                destination.droppableId &&
                            milestone.id.toString() !== source.droppableId
                    )
                    const updatedSource = {
                        ...sourceMilestone,
                        user_stories: sourceMilestone.user_stories.filter(
                            (story) => story.id !== currentStory.id
                        ),
                    }
                    return [updatedSource, ...unaffectedMilestones]
                } else if (source.droppableId === 'backlog') {
                    const destinationMilestone = prevData.find(
                        (milestone) =>
                            milestone.id.toString() === destination.droppableId
                    )

                    const unaffectedMilestones = prevData.filter(
                        (milestone) =>
                            milestone.id.toString() !==
                                destination.droppableId &&
                            milestone.id.toString() !== source.droppableId
                    )
                    const updatedDestination = {
                        ...destinationMilestone,
                        user_stories: [
                            ...destinationMilestone.user_stories,
                            currentStory,
                        ],
                    }
                    return [...unaffectedMilestones, updatedDestination]
                } else {
                    const destinationMilestone = prevData.find(
                        (milestone) =>
                            milestone.id.toString() === destination.droppableId
                    )
                    const sourceMilestone = prevData.find(
                        (milestone) =>
                            milestone.id.toString() === source.droppableId
                    )
                    const unaffectedMilestones = prevData.filter(
                        (milestone) =>
                            milestone.id.toString() !==
                                destination.droppableId &&
                            milestone.id.toString() !== source.droppableId
                    )

                    const updatedSource = {
                        ...sourceMilestone,
                        user_stories: sourceMilestone.user_stories.filter(
                            (story) => story.id !== currentStory.id
                        ),
                    }

                    const updatedDestination = {
                        ...destinationMilestone,
                        user_stories: [
                            ...destinationMilestone.user_stories,
                            currentStory,
                        ],
                    }
                    return [
                        updatedSource,
                        ...unaffectedMilestones,
                        updatedDestination,
                    ]
                }
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

    const isWideScreen = useMedia({ minWidth: '1000px' })
    return (
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
                            {sprintsData?.map((sprint) => (
                                <Sprint key={sprint.id} sprint={sprint} />
                            ))}
                        </ListContainer>
                    </Container>
                    <Container>
                        <TitleContainer>
                            <Title>Backlog</Title>
                            <UserstoryCreation />
                        </TitleContainer>
                        <ListContainer>
                            <IssueList
                                listId="backlog"
                                issues={backlogData ?? []}
                            />
                        </ListContainer>
                    </Container>
                </DragDropContext>
            </IssueContainer>
            {isWideScreen && <Sidebar />}
        </ContentContainer>
    )
}
