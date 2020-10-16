import { useQuery } from 'react-query'
import ActivityListItem from '../../components/home/ActivityListItem'
import { PageBody, PageHeader } from '../../components/Layout'
import PageTitle from '../../components/PageTitle'
import { getUserTimeline } from '../../taiga-api/timelines'
import { getMe } from '../../taiga-api/users'

export default function Activity() {
    const { data: me } = useQuery('me', () => getMe())

    const { data } = useQuery(
        ['timeline', { id: me?.id }],
        (key, { id }) => getUserTimeline(id),
        { enabled: !!me?.id }
    )

    return (
        <>
            <PageHeader>
                <PageTitle
                    title="Activity"
                    description="All activity from this account"
                />
            </PageHeader>
            <PageBody>
                {data?.map((activityItem) => (
                    <ActivityListItem
                        key={activityItem.id}
                        activityItem={activityItem}
                    ></ActivityListItem>
                ))}
            </PageBody>
        </>
    )
}
