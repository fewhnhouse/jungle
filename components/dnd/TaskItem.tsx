import styled from 'styled-components'
import React, { useState } from 'react'
import type { DraggableProvided } from 'react-beautiful-dnd'
import IssueModal from './TaskModal'
import { Task } from '../../taiga-api/tasks'
import { Avatar, Tag, Tooltip } from 'antd'
import { ProfileOutlined } from '@ant-design/icons'
import { getNameInitials } from '../../util/getNameInitials'
import useQueryState from '../../util/useQueryState'

const getBackgroundColor = (isDragging: boolean, isGroupedOver: boolean) => {
    if (isDragging) {
        return '#bdc3c7'
    }

    if (isGroupedOver) {
        return 'red'
    }

    return '#9ed2fd'
}

const StyledTaskIcon = styled(ProfileOutlined)`
    background: #45aaff;
    border-radius: 3px;
    padding: 5px;
    color: #2c3e50;
`

const getBorderColor = (isDragging: boolean) =>
    isDragging ? '#2c3e50' : 'transparent'

const imageSize = 40

interface IContainerProps {
    isDragging: boolean
    isGroupedOver: boolean
}
const Container = styled.div<IContainerProps>`
    border-radius: 4px;
    display: flex;
    align-items: center;
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
        border-color: '#95a5a6';
    }

    /* flexbox */
    display: flex;
`

const Content = styled.div`
    /* flex child */
    flex-grow: 1;
    /*
    Needed to wrap text in ie11
    https://stackoverflow.com/questions/35111090/why-ie11-doesnt-wrap-the-text-in-flexbox
  */
    flex-basis: 100%;
    align-items: center;
    justify-content: space-between;
    /* flex parent */
    display: flex;
    flex-direction: row;
`

const BlockQuote = styled.p`
    margin: 0px 10px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
`

const TagContainer = styled.div`
    display: flex;
    margin-top: ${({ theme }) => `${theme.spacing.mini}`};
    align-items: center;
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
    showStatus?: boolean
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
    showStatus,
}: IssueItemProps) {
    const [expanded, setExpanded] = useQueryState<string | undefined>(
        'openModal',
        undefined
    )
    const handleClick = () => setExpanded(`task-${issue.id}`)
    const handleClose = () => setExpanded(undefined)

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
                <StyledTaskIcon />
                <Content>
                    <BlockQuote>{issue.subject}</BlockQuote>
                    <TagContainer>
                        {showStatus && issue.status && (
                            <Tooltip
                                title={`Status: ${issue.status_extra_info?.name}`}
                            >
                                <Tag>{issue.status_extra_info?.name}</Tag>
                            </Tooltip>
                        )}
                        {issue.assigned_to && (
                            <Tooltip
                                title={`Assigned to ${issue.assigned_to_extra_info?.full_name_display}`}
                            >
                                <Avatar
                                    size="small"
                                    src={issue.assigned_to_extra_info.photo}
                                >
                                    {getNameInitials(
                                        issue.assigned_to_extra_info
                                            .full_name_display
                                    )}
                                </Avatar>
                            </Tooltip>
                        )}
                    </TagContainer>
                </Content>
            </Container>
            <IssueModal
                id={issue.id}
                open={expanded === `task-${issue.id}`}
                onClose={handleClose}
            />
        </>
    )
}

export default React.memo<IssueItemProps>(IssueItem)
