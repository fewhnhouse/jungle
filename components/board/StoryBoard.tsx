import Column from '../dnd/Column'
import {
    DragDropContext,
    DropResult,
    DroppableProvided,
    Droppable,
} from 'react-beautiful-dnd'
import styled from 'styled-components'
import CustomCollapse from '../Collapse'
import { TaskStatus } from '../../taiga-api/tasks'
import { useRouter } from 'next/router'
import { memo } from 'react'
import { updateUserstory, UserStory } from '../../taiga-api/userstories'
import { useQueryCache } from 'react-query'
import { ScrollSyncPane } from 'react-scroll-sync'

const Container = styled.div`
    min-width: 100%;
    display: inline-flex;
`

const BoardContainer = styled.div`
    width: 100%;
    overflow: auto;
`

type Props = {
    stories: UserStory[]
    columns: TaskStatus[]
    withScrollableColumns?: boolean
    title: string
    hasHeader?: boolean
}

const Board = ({
    stories = [],
    columns = [],
    withScrollableColumns,
    title,
    hasHeader,
}: Props) => {
    const router = useRouter()
    const { projectId } = router.query
    const queryCache = useQueryCache()

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

        const story = stories.find(
            (story) => story.id.toString() === actualDraggableId
        )
        queryCache.setQueryData(
            ['userstories', { projectId }],
            (prevData: UserStory[]) =>
                prevData?.map((us) =>
                    us.id === story.id
                        ? {
                              ...story,
                              status: parseInt(destination.droppableId, 10),
                          }
                        : us
                )
        )
        updateUserstory(story.id, {
            status: destination.droppableId,
            version: story.version,
        }).then((updatedStory) => {
            queryCache.setQueryData(
                ['userstories', { projectId }],
                (prevData: UserStory[]) =>
                    prevData?.map((story) =>
                        story.id === updatedStory.id ? updatedStory : story
                    )
            )
            queryCache.invalidateQueries(['milestones', { projectId }])
        })
    }

    return stories.length ? (
        <>
            <CustomCollapse status="default" title={title}>
                <ScrollSyncPane>
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
                                        {columns
                                            .sort((a, b) => a.order - b.order)
                                            .map((status, index: number) => (
                                                <Column
                                                    hasHeader={hasHeader}
                                                    id={status.id}
                                                    key={status.id}
                                                    index={index}
                                                    title={status.name}
                                                    issues={stories.filter(
                                                        (data) =>
                                                            data.status ===
                                                            status.id
                                                    )}
                                                    isScrollable={
                                                        withScrollableColumns
                                                    }
                                                />
                                            ))}
                                        {provided.placeholder}
                                    </Container>
                                )}
                            </Droppable>
                        </DragDropContext>
                    </BoardContainer>
                </ScrollSyncPane>
            </CustomCollapse>
        </>
    ) : null
}

export default memo(Board)
