import CustomCollapse from '../../components/Collapse'
import { DragDropContext, DropResult } from 'react-beautiful-dnd'
import { Issue } from '../../interfaces/Issue'
import { useState } from 'react'
import IssueList from '../../components/backlog/IssueList'
import { sprint } from '../../util/data'
import { reorderTasks } from '../../util/reorder'
import styled from 'styled-components'
import useMedia from 'use-media'

const IssueContainer = styled.div`
    flex: 2;
`

const ContentContainer = styled.div`
    display: flex;
`

const Sidebar = styled.aside`
    flex: 1;
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
                    <CustomCollapse title="Current Sprint">
                        <IssueList
                            listId="1"
                            issues={issues.filter(
                                (item) => item.sprint?.id === '1'
                            )}
                        />
                    </CustomCollapse>
                    <CustomCollapse title="Backlog">
                        <IssueList
                            listId="backlog"
                            issues={issues.filter(
                                (item) => item.sprint?.id === 'backlog'
                            )}
                        />
                    </CustomCollapse>
                </DragDropContext>
            </IssueContainer>
            {isWideScreen && <Sidebar />}
        </ContentContainer>
    )
}
