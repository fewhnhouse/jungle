import styled from 'styled-components'
import { Timeline, TimelineType } from '../../taiga-api/timelines'
import Link from 'next/link'
import { List, Tag } from 'antd'
import { getActivityDate } from '../../util/getActivityDate'

const Description = styled.p`
    margin: 0px ${({ theme }) => `${theme.spacing.small}`};
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
`

const DateSpan = styled.div`
    font-size: 12px;
    white-space: nowrap;
`

const ItemContainer = styled.div`
    width: 100%;
    display: flex;
    padding: ${({ theme }) => `${theme.spacing.small}`};
    justify-content: space-between;
    align-items: center;
    &:hover > #link-buttons {
        opacity: 1;
    }
`

const Content = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    width: calc(100% - 80px);
`

interface Props {
    activityItem: Timeline
}
export default function ActivityListItem({ activityItem }: Props) {
    const [source, item, type] = activityItem.event_type.split('.')
    const user = activityItem.data.user
    const affectedItem = activityItem.data[item] ?? user
    const getItemName = () => {
        if (item === 'userstory' || item === 'epic' || item === 'task') {
            return affectedItem.subject ?? ''
        } else {
            return affectedItem.name ?? ''
        }
    }

    const date = new Date(activityItem.created)
    return (
        <List.Item>
            <ItemContainer>
                <Content>
                    <Tag id="issues-todo">{type}</Tag>
                    <Description>
                        <Link href={`/user/${user?.id}`}>{user.name}</Link>{' '}
                        {type === TimelineType.Change ? 'updated' : 'created'}{' '}
                        <Link
                            href={`projects/${activityItem?.data?.project}/${source}/${affectedItem?.id}`}
                        >
                            {getItemName()}
                        </Link>
                        .
                    </Description>
                </Content>
                <DateSpan>{getActivityDate(date)}</DateSpan>
            </ItemContainer>
        </List.Item>
    )
}
