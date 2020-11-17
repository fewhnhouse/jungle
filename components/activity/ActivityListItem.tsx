import styled from 'styled-components'
import ListItem from '../ListItem'
import { Timeline, TimelineType } from '../../taiga-api/timelines'
import Link from 'next/link'
import { Tag } from 'antd'
import { getActivityDate } from '../../util/getActivityDate'

const Description = styled.p`
    margin: 0px ${({ theme }) => `${theme.spacing.small}`};
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`

const DateSpan = styled.div`
    font-size: 12px;
    white-space: nowrap;
`

const ItemContainer = styled.div`
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
    width: calc(100% - 60px);
`

interface Props {
    activityItem: Timeline
}
export default function ActivityListItem({ activityItem }: Props) {
    const [source, item, type] = activityItem.event_type.split('.')
    const user = activityItem.data.user
    const affectedItem = activityItem.data[item]
    const getItemName = () => {
        if (item === 'userstory' || item === 'epic' || item === 'task') {
            return affectedItem.subject
        } else {
            return affectedItem.name
        }
    }

    const date = new Date(activityItem.created)
    return (
        <ListItem>
            <ItemContainer>
                <Content>
                    <Tag id="issues-todo">{type}</Tag>
                    <Description>
                        <Link href={`/user/${user?.id}`}>{user.name}</Link>{' '}
                        {type === TimelineType.Change ? 'updated' : 'created'}{' '}
                        <Link href={`/${source}/${affectedItem?.id}`}>
                            {getItemName()}
                        </Link>
                        .
                    </Description>
                </Content>
                <DateSpan>{getActivityDate(date)}</DateSpan>
            </ItemContainer>
        </ListItem>
    )
}
