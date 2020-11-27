import { useQuery } from 'react-query'
import YourWork from '../../components/your-work/YourWork'
import { getUserTimeline, Timeline } from '../../taiga-api/timelines'
import { getMe } from '../../taiga-api/users'
import { recentTaskFilter } from '../../util/recentTaskFilter'

export default function YourWorkPage() {
    const { data: me } = useQuery('me', () => getMe())

    const { data: timeline, isLoading } = useQuery(
        ['timeline', { id: me?.id }],
        (key, { id }) => getUserTimeline(id),
        { enabled: !!me?.id }
    )

    const recentTasks: Timeline[] = recentTaskFilter(timeline)

    return (
        <YourWork
            timeline={recentTasks}
            avatarUrl={me?.photo}
            description="Recent work items you are involved in"
            title="Your Work"
            isLoading={isLoading}
        />
    )
}
