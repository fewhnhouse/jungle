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
import IssueItem from './IssueItem'
import Title from '../Title'
import { Issue } from '../../interfaces/Issue'
import { Theme } from '../../pages/_app'

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
    display: flex;
    flex-direction: column;
    opacity: ${({ isDropDisabled }) => (isDropDisabled ? 0.5 : 'inherit')};
    padding: ${({ theme }) => theme.spacing.mini};
    border: 4px;
    margin: ${({ theme }) => `${theme.spacing.mini} ${theme.spacing.small}`};
    padding-bottom: 0;
    transition: background-color 0.2s ease, opacity 0.1s ease;
    user-select: none;
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
    padding-bottom: ${({ theme }) => theme.spacing.mini};;
`

/* stylelint-disable block-no-empty */
const Container = styled.div``
/* stylelint-enable */

type IssueListProps = {
    issues: Issue[]
}

// eslint-disable-next-line react/display-name
const InnerQuoteList = React.memo(({ issues }: IssueListProps) => {
    return (
        <>
            {issues.map((issue: Issue, index: number) => (
                <Draggable key={issue.id} draggableId={issue.id} index={index}>
                    {(
                        dragProvided: DraggableProvided,
                        dragSnapshot: DraggableStateSnapshot
                    ) => (
                        <IssueItem
                            key={issue.id}
                            issue={issue}
                            isDragging={dragSnapshot.isDragging}
                            isGroupedOver={Boolean(
                                dragSnapshot.combineTargetFor
                            )}
                            provided={dragProvided}
                        />
                    )}
                </Draggable>
            ))}
        </>
    )
})

type InnerListProps = {
    dropProvided: DroppableProvided
    issues: Issue[]
    title?: string
}

function InnerList(props: InnerListProps) {
    const { issues, dropProvided } = props
    const title = props.title ? <Title>{props.title}</Title> : null

    return (
        <Container>
            {title}
            <DropZone ref={dropProvided.innerRef}>
                <InnerQuoteList issues={issues} />
                {dropProvided.placeholder}
            </DropZone>
        </Container>
    )
}

type Props = {
    listId?: string
    listType?: string
    issues: Issue[]
    title?: string
    isDropDisabled?: boolean
    style?: Record<string, unknown>
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
                    <InnerList
                        issues={issues}
                        title={title}
                        dropProvided={dropProvided}
                    />
                </Wrapper>
            )}
        </Droppable>
    )
}
