import styled from 'styled-components'
import React from 'react'
import {
    Droppable,
    Draggable,
    DroppableProvided,
    DroppableStateSnapshot,
    DraggableProvided,
    DraggableStateSnapshot,
} from 'react-beautiful-dnd'
import Title from '../Title'
import { Theme } from '../../pages/_app'
import { Task } from '../../taiga-api/tasks'
import { UserStory } from '../../taiga-api/userstories'
import TaskItem from './TaskItem'
import UserstoryItem from './UserstoryItem'

export const getBackgroundColor = (
    isDraggingOver: boolean,
    isDraggingFrom: boolean,
    theme: Theme
): string => {
    if (isDraggingOver) {
        return theme.colors.darkgrey.normal
    }
    if (isDraggingFrom) {
        return theme.colors.darkgrey.normal
    }
    return theme.colors.darkgrey.light
}

type WrapperProps = {
    isDraggingOver: boolean
    isDraggingFrom: boolean
    isDropDisabled: boolean
    theme: Theme
    [key: string]: unknown
}

const Wrapper = styled.div<WrapperProps>`
    background-color: ${(props) =>
        getBackgroundColor(
            props.isDraggingOver,
            props.isDraggingFrom,
            props.theme
        )};
    display: flex;
    flex-direction: column;
    opacity: ${({ isDropDisabled }) => (isDropDisabled ? 0.5 : 'inherit')};
    padding: ${({ theme }) => `${theme.spacing.mini}`};
    border: 4px;
    padding-bottom: 0;
    transition: background-color 0.2s ease, opacity 0.1s ease;
    user-select: none;
    width: 250px;
    height: 100%;
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
`

const scrollContainerHeight = 250

const DropZone = styled.div`
    /* stop the list collapsing when empty */
    min-height: ${scrollContainerHeight}px;
    /*
    not relying on the items for a margin-bottom
    as it will collapse when the list is empty
  */
    padding-bottom: ${({ theme }) => `${theme.spacing.mini}`};
`

type IssueListProps = {
    issues: (Task | UserStory)[]
}

// eslint-disable-next-line react/display-name
const InnerIssueList = React.memo(({ issues }: IssueListProps) => {
    return (
        <>
            {issues.map((issue, index: number) => (
                <Draggable
                    key={issue.id}
                    draggableId={issue.id.toString()}
                    index={index}
                >
                    {(
                        dragProvided: DraggableProvided,
                        dragSnapshot: DraggableStateSnapshot
                    ) =>
                        (issue as Task).user_story ? (
                            <TaskItem
                                key={issue.id}
                                issue={issue}
                                isDragging={dragSnapshot.isDragging}
                                isGroupedOver={Boolean(
                                    dragSnapshot.combineTargetFor
                                )}
                                provided={dragProvided}
                            />
                        ) : (
                            <UserstoryItem
                                key={issue.id}
                                issue={issue}
                                isDragging={dragSnapshot.isDragging}
                                isGroupedOver={Boolean(
                                    dragSnapshot.combineTargetFor
                                )}
                                provided={dragProvided}
                            />
                        )
                    }
                </Draggable>
            ))}
        </>
    )
})

type InnerListProps = {
    dropProvided: DroppableProvided
    issues: (Task | UserStory)[]
    title?: string
}

function InnerListContainer({ issues, title, dropProvided }: InnerListProps) {
    return (
        <div>
            {title ? <Title>{title}</Title> : null}
            <DropZone ref={dropProvided.innerRef}>
                <InnerIssueList issues={issues} />
                {dropProvided.placeholder}
            </DropZone>
        </div>
    )
}

type Props = {
    listId?: string
    listType?: string
    issues: (Task | UserStory)[]
    title?: string
    isDropDisabled?: boolean
    style?: Record<string, unknown>
    // may not be provided - and might be null
    ignoreContainerClipping?: boolean
}

export default function IssueList({
    ignoreContainerClipping,
    isDropDisabled,
    listId = 'LIST',
    listType,
    style,
    issues,
    title,
}: Props) {
    return (
        <Droppable
            droppableId={listId}
            type={listType}
            ignoreContainerClipping={ignoreContainerClipping}
            isDropDisabled={isDropDisabled}
        >
            {(
                dropProvided: DroppableProvided,
                dropSnapshot: DroppableStateSnapshot
            ) => (
                <Wrapper
                    style={style}
                    isDropDisabled={isDropDisabled}
                    isDraggingOver={dropSnapshot.isDraggingOver}
                    isDraggingFrom={!!dropSnapshot.draggingFromThisWith}
                    {...dropProvided.droppableProps}
                >
                    <InnerListContainer
                        issues={issues}
                        title={title}
                        dropProvided={dropProvided}
                    />
                </Wrapper>
            )}
        </Droppable>
    )
}
