import { useState, useEffect } from 'react'
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
import { Status, Task } from '../../interfaces/UserStory'

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
    data: Task[]
    columns: Status[]
    withScrollableColumns?: boolean
    title: string
}

const Board = ({
    id,
    data = [],
    columns = [],
    withScrollableColumns,
    title,
}: Props) => {
    /* eslint-disable react/sort-comp */
    const [issues, setIssues] = useState(data)
    const [ordered, setOrdered] = useState(columns)

    useEffect(() => {
        setOrdered(columns)
        setIssues(data)
    }, [data, columns])

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
            console.log(ordered, columns)
            const reordered = reorder(ordered, source.index, destination.index)

            setOrdered(reordered)

            return
        }

        const newIssues = reorderQuoteMap({
            issues,
            source,
            destination,
        })

        setIssues(newIssues)
    }

    return (
        <>
            <CustomCollapse title={title}>
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
                                    {ordered.map((status, index: number) => (
                                        <Column
                                            id={status.id}
                                            key={status.id}
                                            index={index}
                                            title={status.name}
                                            issues={issues.filter(
                                                (data) =>
                                                    data.status_id === status.id
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
            </CustomCollapse>
        </>
    )
}

export default Board
