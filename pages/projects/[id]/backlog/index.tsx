import { DragDropContext, DropResult } from 'react-beautiful-dnd'
import { Issue } from '../../../../interfaces/Issue'
import IssueList from '../../../../components/backlog/IssueList'
import styled from 'styled-components'
import useMedia from 'use-media'
import { Button } from 'rsuite'
import { useRouter } from 'next/router'
import { IMilestone } from '../../../../interfaces/Project'
import { IUserStory } from '../../../../interfaces/UserStory'
import Sprint from '../../../../components/backlog/Sprint'
import { useQuery, useMutation, queryCache } from 'react-query'
import authInstance from '../../../../util/axiosInstance'

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
        `sprints`,
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
                ? backlogData[source.index]
                : currentSprint.user_stories.find(
                      (story) => story.sprint_order === source.index
                  )
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
            queryCache.invalidateQueries('sprints')
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
                            <Button size="sm" appearance="ghost">
                                Create Sprint
                            </Button>
                        </TitleContainer>
                        <ListContainer>
                            {sprintsData.map((sprint) => (
                                <Sprint key={sprint.id} sprint={sprint} />
                            ))}
                        </ListContainer>
                    </Container>
                    <Container>
                        <TitleContainer>
                            <Title>Backlog</Title>
                            <Button size="sm" appearance="ghost">
                                Create Issue / Story
                            </Button>
                        </TitleContainer>
                        <ListContainer>
                            <IssueList listId="backlog" issues={backlogData} />
                        </ListContainer>
                    </Container>
                </DragDropContext>
            </IssueContainer>
            {isWideScreen && <Sidebar />}
        </ContentContainer>
    )
}
