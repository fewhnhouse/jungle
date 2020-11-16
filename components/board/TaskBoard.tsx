import Column from '../dnd/Column'
import {
    DragDropContext,
    DropResult,
    DroppableProvided,
    Droppable,
} from 'react-beautiful-dnd'
import styled from 'styled-components'
import CustomCollapse from '../Collapse'
import { queryCache } from 'react-query'
import { TaskStatus, updateTask, Task } from '../../taiga-api/tasks'
import { useRouter } from 'next/router'
import { memo } from 'react'
import { Empty } from 'antd'

const Container = styled.div`
    min-width: 100%;
    display: inline-flex;
`

const BoardContainer = styled.div`
    width: 100%;
    overflow: auto;
`

type Props = {
    columns: TaskStatus[]
    tasks: Task[]
    milestoneIds: number[]
    withScrollableColumns?: boolean
    title: string
    hasHeader?: boolean
}

const Board = ({
    columns = [],
    tasks = [],
    milestoneIds,
    withScrollableColumns,
    title,
    hasHeader,
}: Props) => {
    const router = useRouter()
    const { projectId } = router.query

    /* eslint-disable react/sort-comp */

    function onDragStart() {
        // Add a little vibration if the browser supports it.
        // Add's a nice little physical feedback
        if (window.navigator.vibrate) {
            window.navigator.vibrate(100)
        }
    }

    const onDragEnd = ({ source, destination, draggableId }: DropResult) => {
        // dropped nowhere
        if (!destination) {
            return
        }

        // did not move anywhere - can bail early
        if (
            source.droppableId === destination.droppableId &&
            source.index === destination.index
        ) {
            return
        }

        const actualDraggableId = draggableId.split('-')[1]

        const task = tasks.find(
            (task) => task.id.toString() === actualDraggableId
        )
        queryCache.setQueryData(
            [
                'tasks',
                {
                    projectId,
                    milestoneIds,
                },
            ],
            (prevData: Task[]) =>
                prevData.map((t) =>
                    t.id === task.id
                        ? {
                              ...task,
                              status: parseInt(destination.droppableId, 10),
                          }
                        : t
                )
        )
        updateTask(task.id, {
            status: destination.droppableId,
            version: task.version,
        }).then(() => {
            queryCache.invalidateQueries([
                'tasks',
                {
                    projectId,
                    milestoneIds,
                },
            ])
        })
    }

    return (
        <CustomCollapse title={title} status="default">
            {tasks.length ? (
                <BoardContainer>
                    <DragDropContext
                        onDragStart={onDragStart}
                        onDragEnd={onDragEnd}
                    >
                        <Droppable
                            droppableId={`board-${projectId}`}
                            type="COLUMN"
                            direction="horizontal"
                        >
                            {(provided: DroppableProvided) => (
                                <Container
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                >
                                    {columns.map((status, index: number) => (
                                        <Column
                                            hasHeader={hasHeader}
                                            id={status.id}
                                            key={status.id}
                                            index={index}
                                            title={status.name}
                                            issues={tasks.filter(
                                                (data) =>
                                                    data.status === status.id
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
            ) : (
                <Empty />
            )}
        </CustomCollapse>
    )
}

export default memo(Board)
