import CustomCollapse from '../../../../components/Collapse'
import { DragDropContext, DropResult } from 'react-beautiful-dnd'
import { Issue } from '../../../../interfaces/Issue'
import { useState } from 'react'
import IssueList from '../../../../components/backlog/IssueList'
import { sprint } from '../../../../util/data'
import { reorderTasks } from '../../../../util/reorder'
import styled from 'styled-components'
import useMedia from 'use-media'
import { Button } from 'shards-react'

const IssueContainer = styled.div`
    flex: 2;
    flex-wrap: wrap;
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

export default function Backlog({ data = [] }: { data: Issue[] }) {
    const [issues, setIssues] = useState(sprint)
    function onDragStart() {
        // Add a little vibration if the browser supports it.
        // Add's a nice little physical feedback
        if (window.navigator.vibrate) {
            window.navigator.vibrate(100)
        }
    }

    function onDragEnd({ source, destination }: DropResult) {
        // dropped outside the list
        if (!destination) {
            return
        }
        if (destination.index === source.index) {
            return
        }
        const { issueMap } = reorderTasks({
            issueMap: issues,
            source,
            destination,
        })
        setIssues(issueMap)
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
                            <Button size="sm" outline theme="success">
                                Create Sprint
                            </Button>
                        </TitleContainer>
                        <ListContainer>
                            <CustomCollapse title="Current Sprint">
                                <IssueList
                                    listId="1"
                                    issues={issues.filter(
                                        (item) => item.sprint?.id === '1'
                                    )}
                                />
                            </CustomCollapse>
                        </ListContainer>
                    </Container>
                    <Container>
                        <TitleContainer>
                            <Title>Backlog</Title>
                            <Button size="sm" outline theme="success">
                                Create Issue / Story
                            </Button>
                        </TitleContainer>
                        <ListContainer>
                            <IssueList
                                listId="backlog"
                                issues={issues.filter(
                                    (item) => item.sprint?.id === 'backlog'
                                )}
                            />
                        </ListContainer>
                    </Container>
                </DragDropContext>
            </IssueContainer>
            {isWideScreen && <Sidebar />}
        </ContentContainer>
    )
}
