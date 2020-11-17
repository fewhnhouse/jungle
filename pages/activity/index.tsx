import { useQuery } from 'react-query'
import Activity from '../../components/activity/Activity'
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
        <Activity
            activity={data ?? []}
            title="User Activity"
            isLoading={isLoading}
            description="All activity from this account"
            avatarUrl={me?.photo}
        />
    )
}
