import styled from 'styled-components'
import ListItem from '../ListItem'
import { Tag } from 'rsuite'
import { Timeline, TimelineType } from '../../taiga-api/timelines'
import Link from 'next/link'

const IssueName = styled.span`
    margin: 0px ${({ theme }) => `${theme.spacing.small}`};
`

const Description = styled.span`
    margin: 0px ${({ theme }) => `${theme.spacing.small}`};
`

const ItemContainer = styled.div`
    display: flex;
    padding: ${({ theme }) => `${theme.spacing.small}`};
    min-width: 300px;
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
                    <IssueName>
                        <Description>
                            <Link as={`/user/${user?.id}`} href="/user/[id]">
                                {user.name}
                            </Link>{' '}
                            {type === TimelineType.Change
                                ? 'updated'
                                : 'created'}{' '}
                            
                            <Link
                                as={`/${source}/${affectedItem?.id}`}
                                href={`/${source}/[id]`}
                            >
                                {getItemName()}
                            </Link>
                            .
                        </Description>
                    </IssueName>
                </Content>
                <div>
                    <span>
                        {`${date.toLocaleDateString()}, ${date.toLocaleTimeString()}`}
                    </span>
                </div>
            </ItemContainer>
        </ListItem>
    )
}
