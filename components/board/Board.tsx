import Column from './Column'
import {
    DragDropContext,
    DropResult,
    DraggableLocation,
    DroppableProvided,
    Droppable,
} from 'react-beautiful-dnd'
import styled from 'styled-components'
import CustomCollapse from '../Collapse'
import { useQuery, queryCache } from 'react-query'
import { getTasks, TaskStatus, updateTask, Task } from '../../taiga-api/tasks'
import { useRouter } from 'next/router'
import { memo } from 'react'

const Container = styled.div`
    min-width: 100vw;
    display: inline-flex;
`

const BoardContainer = styled.div`
    width: 100%;
    overflow: auto;
`

type Props = {
    milestoneId: string
    storyId: string
    columns: TaskStatus[]
    withScrollableColumns?: boolean
    title: string
}

const Board = ({
    milestoneId,
    storyId,
    columns = [],
    withScrollableColumns,
    title,
}: Props) => {
    const router = useRouter()
    const { projectId } = router.query
    const { data: tasks = [] } = useQuery(
        ['tasks', { milestoneId, storyId, projectId }],
        async (key, { milestoneId, storyId, projectId }) => {
            return getTasks({
                milestone: milestoneId,
                userStory: storyId,
                projectId: projectId as string,
            })
        },
        { enabled: projectId && milestoneId && storyId }
    )
    /* eslint-disable react/sort-comp */

    function onDragStart() {
        // Add a little vibration if the browser supports it.
        // Add's a nice little physical feedback
        if (window.navigator.vibrate) {
            window.navigator.vibrate(100)
        }
    }

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
        const task = tasks.find(
            (task) => task.id.toString() === result.draggableId
        )
        queryCache.setQueryData(
            ['tasks', { milestoneId, storyId, projectId }],
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
                { milestoneId, storyId, projectId },
            ])
        })
    }

    return (
        <>
            <CustomCollapse title={title}>
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
            </CustomCollapse>
        </>
    )
}

export default memo(Board)
