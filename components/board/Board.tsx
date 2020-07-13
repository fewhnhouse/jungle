import { useState } from 'react'
import Column from './Column'
import reorder, { reorderQuoteMap } from '../../util/reorder'
import {
    DragDropContext,
    DropResult,
    DraggableLocation,
    DroppableProvided,
    Droppable,
} from 'react-beautiful-dnd'
import styled from 'styled-components'
import { Issue } from '../../interfaces/Issue'
import CustomCollapse from '../Collapse'

const Container = styled.div`
    min-width: 100vw;
    display: inline-flex;
`

const BoardContainer = styled.div`
    width: 100%;
    overflow: auto;
`

type Props = {
    id: string
    data: Issue[]
    columns: string[]
    withScrollableColumns?: boolean
}

const Board = ({
    id,
    data = [],
    columns = [],
    withScrollableColumns,
}: Props) => {
    /* eslint-disable react/sort-comp */
    const [issues, setIssues] = useState(data)
    const [ordered, setOrdered] = useState(columns)

    const onDragEnd = (result: DropResult) => {
        // dropped nowhere
        if (!result.destination) {
            return
        }

        const source: DraggableLocation = result.source
        const destination: DraggableLocation = result.destination

        // did not move anywhere - can bail early
        if (
            source.droppableId === destination.droppableId &&
            source.index === destination.index
        ) {
            return
        }

        // reordering column
        if (result.type === 'COLUMN') {
            const reordered: string[] = reorder(
                ordered,
                source.index,
                destination.index
            )

            setOrdered(reordered)

            return
        }

        const { issueMap } = reorderQuoteMap({
            issueMap: issues,
            source,
            destination,
        })

        setIssues(issueMap)
    }

    return (
        <>
            <CustomCollapse title="Story">
                <BoardContainer>
                    <DragDropContext onDragEnd={onDragEnd}>
                        <Droppable
                            droppableId={id}
                            type="COLUMN"
                            direction="horizontal"
                        >
                            {(provided: DroppableProvided) => (
                                <Container
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                >
                                    {ordered.map(
                                        (key: string, index: number) => (
                                            <Column
                                                key={key}
                                                index={index}
                                                title={key}
                                                issues={issues.filter(
                                                    (data) =>
                                                        data.status === key
                                                )}
                                                isScrollable={
                                                    withScrollableColumns
                                                }
                                            />
                                        )
                                    )}
                                    {provided.placeholder}
                                </Container>
                            )}
                        </Droppable>
                    </DragDropContext>
                </BoardContainer>
            </CustomCollapse>
        </>
    )
}

export default Board
