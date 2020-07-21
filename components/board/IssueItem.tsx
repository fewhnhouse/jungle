import styled from 'styled-components'
import React, { useState } from 'react'
import type { DraggableProvided } from 'react-beautiful-dnd'
import { Issue } from '../../interfaces/Issue'
import IssueModal from '../IssueModal'
import { Task } from '../../interfaces/UserStory'

const getBackgroundColor = (isDragging: boolean, isGroupedOver: boolean) => {
    if (isDragging) {
        return '#bdc3c7'
    }

    if (isGroupedOver) {
        return 'red'
    }

    return '#ecf0f1'
}

const getBorderColor = (isDragging: boolean) =>
    isDragging ? '#2c3e50' : 'transparent'

const imageSize = 40

interface IContainerProps {
    isDragging: boolean
    isGroupedOver: boolean
}
const Container = styled.div<IContainerProps>`
    border-radius: 4px;
    border: 2px solid transparent;
    border-color: ${(props) => getBorderColor(props.isDragging)};
    background-color: ${(props) =>
        getBackgroundColor(props.isDragging, props.isGroupedOver)};
    box-shadow: ${({ isDragging }) =>
        isDragging ? `box-shadow: 0px 0px 10px 0px black` : 'none'};
    box-sizing: border-box;
    padding: ${({ theme }) => `${theme.spacing.mini}`};
    min-height: ${imageSize}px;
    margin-bottom: ${({ theme }) => `${theme.spacing.mini}`};
    user-select: none;

    /* anchor overrides */
    color: #2c3e50;

    &:hover,
    &:active {
        color: #7f8c8d;
    }

    &:focus {
        outline: none;
        border-color: '#95a5a6';
        box-shadow: none;
    }

    /* flexbox */
    display: flex;
`

const Avatar = styled.img`
    width: ${imageSize}px;
    height: ${imageSize}px;
    border-radius: 50%;
    margin-right: ${({ theme }) => `${theme.spacing.mini}`};
    flex-shrink: 0;
    flex-grow: 0;
`

const Content = styled.div`
    /* flex child */
    flex-grow: 1;
    /*
    Needed to wrap text in ie11
    https://stackoverflow.com/questions/35111090/why-ie11-doesnt-wrap-the-text-in-flexbox
  */
    flex-basis: 100%;
    /* flex parent */
    display: flex;
    flex-direction: column;
`

const BlockQuote = styled.div`
    &::before {
        content: open-quote;
    }
    &::after {
        content: close-quote;
    }
`

const Footer = styled.div`
    display: flex;
    margin-top: ${({ theme }) => `${theme.spacing.mini}`};
    align-items: center;
`

const Author = styled.small`
    color: ${(props: { colors: { hard: string; soft: string } }) =>
        props.colors.hard};
    flex-grow: 0;
    margin: 0;
    background-color: ${(props: { colors: { hard: string; soft: string } }) =>
        props.colors.soft};
    border-radius: 4px;
    font-weight: normal;
    padding: ${({ theme }) => `${theme.spacing.mini}`};
`

const QuoteId = styled.small`
    flex-grow: 1;
    flex-shrink: 1;
    margin: 0;
    font-weight: normal;
    text-overflow: ellipsis;
    text-align: right;
`

function getStyle(
    provided: DraggableProvided,
    style?: Record<string, unknown>
) {
    if (!style) {
        return provided.draggableProps.style
    }

    return {
        ...provided.draggableProps.style,
        ...style,
    }
}

interface IssueItemProps {
    issue: Task
    isDragging: boolean
    provided: DraggableProvided
    isGroupedOver?: boolean
    style?: Record<string, unknown>
    index?: number
}

// Previously this extended React.Component
// That was a good thing, because using React.PureComponent can hide
// issues with the selectors. However, moving it over does can considerable
// performance improvements when reordering big lists (400ms => 200ms)
// Need to be super sure we are not relying on PureComponent here for
// things we should be doing in the selector as we do not know if consumers
// will be using PureComponent
function IssueItem({
    issue,
    isDragging,
    isGroupedOver,
    provided,
    style,
    index,
}: IssueItemProps) {
    const [expanded, setExpanded] = useState(false)

    const handleClick = () => setExpanded(true)
    const handleClose = () => setExpanded(false)

    return (
        <>
            <Container
                onClick={handleClick}
                isDragging={isDragging}
                isGroupedOver={isGroupedOver}
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                style={getStyle(provided, style)}
                data-is-dragging={isDragging}
                data-testid={issue.id}
                data-index={index}
                aria-label={`${issue.subject}`}
            >
                <Avatar src={'issue.author.avatarUrl'} alt={'issue.author.name'} />
                <Content>
                    <BlockQuote>{issue.subject}</BlockQuote>
                    <Footer>
                        <Author colors={{ hard: '#fff', soft: '#fff' }}>
                            Author Name
                        </Author>
                        <QuoteId>{issue.id}</QuoteId>
                    </Footer>
                </Content>
            </Container>
            <IssueModal open={expanded} onClose={handleClose} />
        </>
    )
}

export default React.memo<IssueItemProps>(IssueItem)
