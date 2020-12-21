import { Empty, List, Skeleton } from 'antd'
import { Timeline } from '../../taiga-api/timelines'
import ActivityListItem from './ActivityListItem'
import { PageBody, PageHeader } from '../Layout'
import PageTitle from '../PageTitle'

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
                <Skeleton loading={isLoading} active paragraph={{ rows: 5 }}>
                    <List
                        dataSource={activity ?? []}
                        renderItem={(item) => (
                            <ActivityListItem
                                key={item.id}
                                activityItem={item}
                            />
                        )}
                    >
                        {!activity?.length && (
                            <Empty description="No activity yet." />
                        )}
                    </List>
                </Skeleton>
            </PageBody>
        </div>
    )
}
