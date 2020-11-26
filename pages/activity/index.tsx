import { List, Skeleton } from 'antd'
import { useQuery } from 'react-query'
import ActivityListItem from '../../components/activity/ActivityListItem'
import { PageBody, PageHeader } from '../../components/Layout'
import PageTitle from '../../components/PageTitle'
import { getUserTimeline } from '../../taiga-api/timelines'
import { getMe } from '../../taiga-api/users'

export default function UserActivity() {
    const { data: me } = useQuery('me', () => getMe())

    const { data, isLoading } = useQuery(
        ['timeline', { id: me?.id }],
        (key, { id }) => getUserTimeline(id),
        { enabled: !!me?.id }
    )

    return (
        <div>
            <PageHeader>
                <PageTitle
                    avatarUrl={me?.photo}
                    title="User Activity"
                    description="All activity from this account"
                />
            </PageHeader>
            <PageBody>
                <Skeleton loading={isLoading} active paragraph={{ rows: 5 }}>
                    <List>
                        {data
                            ?.filter((_, index) => index < 10)
                            .map((activityItem) => (
                                <ActivityListItem
                                    key={activityItem.id}
                                    activityItem={activityItem}
                                ></ActivityListItem>
                            )) ?? null}
                    </List>
                </Skeleton>
            </PageBody>
        </div>
    )
}
