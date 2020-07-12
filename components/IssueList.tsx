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
import Title from './Title'
import { Issue } from '../interfaces/Issue'


export const getBackgroundColor = (
    isDraggingOver: boolean,
    isDraggingFrom: boolean
): string => {
    if (isDraggingOver) {
        return '#7f8c8d'
    }
    if (isDraggingFrom) {
        return '#7f8c8d'
    }
    return '#95a5a6'
}

interface WrapperProps {
    isDraggingOver: boolean
    isDraggingFrom: boolean
    isDropDisabled: boolean
}

const Wrapper = styled.div`
    background-color: ${(props: WrapperProps) =>
        getBackgroundColor(props.isDraggingOver, props.isDraggingFrom)};
    display: flex;
    flex-direction: column;
    opacity: ${({ isDropDisabled }: WrapperProps) =>
        isDropDisabled ? 0.5 : 'inherit'};
    padding: 4px;
    border: 4px;
    padding-bottom: 0;
    transition: background-color 0.2s ease, opacity 0.1s ease;
    user-select: none;
    width: 250px;
    height: 100%;
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
`

const scrollContainerHeight: number = 250

const DropZone = styled.div`
    /* stop the list collapsing when empty */
    min-height: ${scrollContainerHeight}px;
    /*
    not relying on the items for a margin-bottom
    as it will collapse when the list is empty
  */
    padding-bottom: 4px;
`

const ScrollContainer = styled.div`
    overflow-x: hidden;
    overflow-y: auto;
    max-height: ${scrollContainerHeight}px;
`

/* stylelint-disable block-no-empty */
const Container = styled.div``
/* stylelint-enable */

type Props = {
    listId?: string
    listType?: string
    issues: Issue[]
    title?: string
    internalScroll?: boolean
    scrollContainerStyle?: Object
    isDropDisabled?: boolean
    isCombineEnabled?: boolean
    style?: Object
    // may not be provided - and might be null
    ignoreContainerClipping?: boolean

    useClone?: boolean
}

type IssueListProps = {
    issues: Issue[]
}

const InnerQuoteList = React.memo((props: IssueListProps) => {
    return props.issues.map((issue: Issue, index: number) => (
        <Draggable key={issue.id} draggableId={issue.id} index={index}>
            {(
                dragProvided: DraggableProvided,
                dragSnapshot: DraggableStateSnapshot
            ) => (
                <IssueItem
                    key={issue.id}
                    issue={issue}
                    isDragging={dragSnapshot.isDragging}
                    isGroupedOver={Boolean(dragSnapshot.combineTargetFor)}
                    provided={dragProvided}
                />
            )}
        </Draggable>
    ))
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

export default function IssueList({
    ignoreContainerClipping,
    internalScroll,
    scrollContainerStyle,
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
                    isDraggingOver={dropSnapshot.isDraggingOver}
                    isDropDisabled={isDropDisabled}
                    isDraggingFrom={Boolean(dropSnapshot.draggingFromThisWith)}
                    {...dropProvided.droppableProps}
                >
                    {internalScroll ? (
                        <ScrollContainer style={scrollContainerStyle}>
                            <InnerList
                                issues={issues}
                                title={title}
                                dropProvided={dropProvided}
                            />
                        </ScrollContainer>
                    ) : (
                        <InnerList
                            issues={issues}
                            title={title}
                            dropProvided={dropProvided}
                        />
                    )}
                </Wrapper>
            )}
        </Droppable>
    )
}
