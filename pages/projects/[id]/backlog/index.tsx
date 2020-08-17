import { DragDropContext, DropResult } from 'react-beautiful-dnd'
import { Issue } from '../../../../interfaces/Issue'
import IssueList from '../../../../components/backlog/IssueList'
import styled from 'styled-components'
import useMedia from 'use-media'
import { useRouter } from 'next/router'
import { IMilestone } from '../../../../interfaces/Project'
import { IUserStory } from '../../../../interfaces/UserStory'
import Sprint from '../../../../components/backlog/Sprint'
import { useQuery, useMutation, queryCache } from 'react-query'
import authInstance from '../../../../util/axiosInstance'
import SprintCreation from '../../../../components/backlog/SprintCreation'
import UserstoryCreation from '../../../../components/backlog/UserstoryCreation'
import { UserStory } from '../../../../api/userstories'

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

interface UserstoryMutation {
    id: number
    milestoneId: number | null
    order: number
    version: number
}

export default function Backlog({ data = [] }: { data: Issue[] }) {
    const { id } = useRouter().query
    const updateUserstory = ({
        id,
        milestoneId,
        order,
        version,
    }: UserstoryMutation) => {
        return authInstance
            .patch<IUserStory>(`/userstories/${id}`, {
                milestone: milestoneId,
                sprint_order: order,
                version,
            })
            .then((res) => res.data)
    }
    const [mutate] = useMutation<IUserStory, UserstoryMutation>(updateUserstory)

    const { data: backlogData = [], error } = useQuery('backlog', async () => {
        const { data } = await authInstance.get<IUserStory[]>(
            `/userstories?milestone=null&project=${id}`
        )
        return data
    })
    const { data: sprintsData = [], error: sprintError } = useQuery(
        'milestones',
        async () => {
            const { data } = await authInstance.get<IMilestone[]>(
                `/milestones?closed=false&project=${id}`
            )
            return data
        }
    )

    function onDragStart() {
        // Add a little vibration if the browser supports it.
        // Add's a nice little physical feedback
        if (window.navigator.vibrate) {
            window.navigator.vibrate(100)
        }
    }

    function onDragEnd({ source, destination }: DropResult) {
        // dropped outside the list
        console.log(source, destination)
        if (!destination) {
            return
        }
        if (destination.index === source.index) {
            return
        }

        const currentSprint = sprintsData.find(
            (sprint) => sprint.id.toString() === source.droppableId
        )
        const currentStory =
            source.droppableId === 'backlog'
                ? backlogData.find((story) => story.backlog_order === source.index)
                : currentSprint.user_stories.find(
                      (story) => story.sprint_order === source.index
                  )
        queryCache.setQueryData('backlog', (prevData: UserStory[]) => {
            if (source.droppableId === destination.droppableId) {
                return prevData
            }
            if (source.droppableId === 'backlog') {
                return prevData.filter((story) => story.id !== currentStory.id)
            } else if (destination.droppableId === 'backlog') {
                return [...prevData, currentStory]
            }
        })
        queryCache.setQueryData('milestones', (prevData: IMilestone[]) => {
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
                        milestone.id.toString() !== destination.droppableId &&
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
                        milestone.id.toString() !== destination.droppableId &&
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
                        milestone.id.toString() !== destination.droppableId &&
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
        })
        mutate({
            id: currentStory.id,
            milestoneId:
                destination.droppableId === 'backlog'
                    ? null
                    : parseInt(destination.droppableId, 10),
            order: destination.index,
            version: currentStory.version,
        }).then((res) => {
            queryCache.invalidateQueries('backlog')
            queryCache.invalidateQueries('milestones')
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
