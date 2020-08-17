import { useState, useEffect } from 'react'
import Column from './Column'
import reorder, { reorderBoard } from '../../util/reorder'
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
import { Status, Task, IUserStory } from '../../interfaces/UserStory'
import { useQuery } from 'react-query'
import Axios from 'axios'
import authInstance from '../../util/axiosInstance'

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
    columns: Status[]
    withScrollableColumns?: boolean
    title: string
}

const Board = ({ id, columns = [], withScrollableColumns, title }: Props) => {
    const { data: tasks = [] } = useQuery('tasks', async () => {
        const { data } = await authInstance.get<Task[]>(`/tasks/${id}`)
        return data
    })
    /* eslint-disable react/sort-comp */
    const [issues, setIssues] = useState(tasks)
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
            const reordered = reorder(ordered, source.index, destination.index)

            setOrdered(reordered)

            return
        }

        const newIssues = reorderBoard({
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
                            droppableId={`board-${id}`}
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
                                            issues={(issues as any).filter(
                                                (data) =>
                                                    (data.status ||
                                                        data.status_id) ===
                                                    status.id
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
