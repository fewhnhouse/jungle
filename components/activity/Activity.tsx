import { Skeleton } from 'antd'
import styled from 'styled-components'
import { Timeline } from '../../taiga-api/timelines'
import ActivityListItem from './ActivityListItem'
import { PageBody, PageHeader } from '../Layout'
import PageTitle from '../PageTitle'

const List = styled.ul`
    list-style: none;
    padding: 0;
    @media screen and (max-width: 400px) {
        width: 350px;
    }
`

interface Props {
    title?: string
    description?: string
    avatarUrl?: string
    activity: Timeline[]
    isLoading?: boolean
}
export default function Activity({
    title,
    description,
    avatarUrl,
    activity,
    isLoading,
}: Props) {
    return (
        <div>
            <PageHeader>
                <PageTitle
                    avatarUrl={avatarUrl}
                    title={title}
                    description={description}
                />
            </PageHeader>
            <PageBody>
                {isLoading && <Skeleton active paragraph={{ rows: 5 }} />}
                <List>
                    {activity
                        ?.filter((_, index) => index < 10)
                        .map((activityItem) => (
                            <ActivityListItem
                                key={activityItem.id}
                                activityItem={activityItem}
                            ></ActivityListItem>
                        ))}
                </List>
            </PageBody>
        </div>
    )
}
