import Column from '../dnd/Column'
import {
    DragDropContext,
    DropResult,
    DraggableLocation,
    DroppableProvided,
    Droppable,
} from 'react-beautiful-dnd'
import styled from 'styled-components'
import CustomCollapse from '../Collapse'
import { TaskStatus } from '../../taiga-api/tasks'
import { useRouter } from 'next/router'
import { memo } from 'react'
import { updateUserstory, UserStory } from '../../taiga-api/userstories'
import { queryCache } from 'react-query'
import { Milestone } from '../../taiga-api/milestones'

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
        const story = stories.find(
            (story) => story.id.toString() === result.draggableId
        )
        queryCache.setQueryData('milestones', (prevData: Milestone[]) =>
            prevData.map((m) =>
                m.id === story.milestone
                    ? {
                          ...m,
                          user_stories: m.user_stories.map((s) =>
                              s.id === story.id
                                  ? {
                                        ...story,
                                        status: parseInt(
                                            destination.droppableId,
                                            10
                                        ),
                                    }
                                  : s
                          ),
                      }
                    : m
            )
        )
        updateUserstory(story.id, {
            status: destination.droppableId,
            version: story.version,
        }).then(() => {
            queryCache.invalidateQueries('milestones')
        })
    }

    return stories.length ? (
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
                                            hasHeader={hasHeader}
                                            id={status.id}
                                            key={status.id}
                                            index={index}
                                            title={status.name}
                                            issues={stories.filter(
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
    ) : null
}

export default memo(Board)
