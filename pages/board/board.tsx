import { useState } from 'react'
import Column from './column'
import reorder, { reorderQuoteMap } from './reorder'
import {
    DragDropContext,
    DropResult,
    DraggableLocation,
    DroppableProvided,
    Droppable,
} from 'react-beautiful-dnd'
import styled from 'styled-components'
import { Issue } from '../../interfaces/Issue'

const Container = styled.div`
    min-width: 100vw;
    display: inline-flex;
`

const BoardContainer = styled.div`
    width: 100%;
    overflow: auto;
`

const StoryHeader = styled.div`
    height: 30px;
    margin: 5px 10px;
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 0px 10px;
    background-color: #ecf0f1;
    border-radius: 4px;
`

type Props = {
    id: string
    data: Issue[]
    columns: string[]
    withScrollableColumns?: boolean
}

const Board = ({ id, data, columns, withScrollableColumns }: Props) => {
    /* eslint-disable react/sort-comp */

    const [issues, setColumns] = useState(data)
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

        const data = reorderQuoteMap({
            issueMap: issues,
            source,
            destination,
        })

        setColumns(data.issueMap)
    }

    return (
        <>
            <StoryHeader>Story</StoryHeader>
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
                                {ordered.map((key: string, index: number) => (
                                    <Column
                                        key={key}
                                        index={index}
                                        title={key}
                                        issues={issues.filter(
                                            (data) => data.status === key
                                        )}
                                        isScrollable={withScrollableColumns}
                                    />
                                ))}
                                {provided.placeholder}
                            </Container>
                        )}
                    </Droppable>
                </DragDropContext>
            </BoardContainer>
        </>
    )
}

export default Board
