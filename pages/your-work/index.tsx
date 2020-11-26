import { List, Skeleton } from 'antd'
import { useQuery } from 'react-query'
import { PageBody, PageHeader } from '../../components/Layout'
import PageTitle from '../../components/PageTitle'
import YourWorkItem from '../../components/your-work/YourWorkItem'
import { getUserTimeline, Timeline } from '../../taiga-api/timelines'
import { getMe } from '../../taiga-api/users'
import { recentTaskFilter } from '../../util/recentTaskFilter'

export default function YourWork() {
    const { data: me } = useQuery('me', () => getMe())

    const { data: timeline, isLoading } = useQuery(
        ['timeline', { id: me?.id }],
        (key, { id }) => getUserTimeline(id),
        { enabled: !!me?.id }
    )

    const recentTasks: Timeline[] = recentTaskFilter(timeline)

    return (
        <div>
            <PageHeader>
                <PageTitle
                    avatarUrl={me?.photo}
                    title="Your Work"
                    description="Recent work items you are involved in"
                />
            </PageHeader>
            <PageBody>
                <Skeleton loading={isLoading} active paragraph={{ rows: 5 }}>
                    <List style={{ width: '100%' }}>
                        {recentTasks?.map((item) => (
                            <YourWorkItem key={item.id} item={item} />
                        ))}
                    </List>
                </Skeleton>
            </PageBody>
        </div>
    )
}
