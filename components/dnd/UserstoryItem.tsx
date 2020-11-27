import styled from 'styled-components'
import React, { useState } from 'react'
import type { DraggableProvided } from 'react-beautiful-dnd'
import IssueModal from './UserstoryModal'
import { UserStory } from '../../taiga-api/userstories'
import { Avatar, Tag, Tooltip } from 'antd'
import { BookOutlined } from '@ant-design/icons'
import { getNameInitials } from '../../util/getNameInitials'
import { useQuery } from 'react-query'
import { getPoints } from '../../taiga-api/points'
import { useRouter } from 'next/router'
import useQueryState from '../../util/useQueryState'

const getBackgroundColor = (isDragging: boolean, isGroupedOver: boolean) => {
    if (isDragging) {
        return '#bdc3c7'
    }

    if (isGroupedOver) {
        return 'red'
    }

    return '#b4f0cd'
}

const StyledUserStoryIcon = styled(BookOutlined)`
    background: #2ecc71;
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
        outline: none;
        border-color: '#95a5a6';
        box-shadow: none;
    }

    /* flexbox */
    display: flex;
`

const Content = styled.div`
    /* flex child */
    max-width: calc(100% - 20px);
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

const Footer = styled.div`
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
    issue: UserStory
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
    showStatus,
    isDragging,
    isGroupedOver,
    provided,
    style,
    index,
}: IssueItemProps) {
    const { projectId } = useRouter().query
    const [expanded, setExpanded] = useQueryState<string|undefined>('openModal', undefined)
    const handleClick = () => setExpanded(`story-${issue.id}`)
    const handleClose = () => setExpanded(undefined)
    const { data: pointsData } = useQuery(
        'storypoints',
        async () => await getPoints(projectId as string)
    )
    const points =
        Object.keys(issue.points).reduce((prev: number, curr: string) => {
            const point = pointsData?.find(
                (point) => issue.points[curr] === point.id
            )
            return prev + (point?.value ?? 0)
        }, 0) ?? 0

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
                <StyledUserStoryIcon />
                <Content>
                    <BlockQuote>{issue.subject}</BlockQuote>
                    <Footer>
                        {showStatus && issue.status && (
                            <Tooltip
                                title={`Status: ${issue.status_extra_info?.name}`}
                            >
                                <Tag>{issue.status_extra_info?.name}</Tag>
                            </Tooltip>
                        )}
                        {!!points && (
                            <Tooltip title={`Story Points: ${points}`}>
                                <Tag>{points}</Tag>
                            </Tooltip>
                        )}
                        {issue.assigned_to && (
                            <Tooltip
                                title={`Assigned to ${issue.assigned_to_extra_info?.full_name_display}`}
                            >
                                <Avatar
                                    size="small"
                                    src={issue.assigned_to_extra_info?.photo}
                                >
                                    {getNameInitials(
                                        issue.assigned_to_extra_info
                                            ?.full_name_display
                                    )}
                                </Avatar>
                            </Tooltip>
                        )}
                    </Footer>
                </Content>
            </Container>
            <IssueModal
                id={issue.id}
                open={expanded === `story-${issue.id}`}
                onClose={handleClose}
            />
        </>
    )
}

export default React.memo<IssueItemProps>(IssueItem)
