import { List, Skeleton } from 'antd'
import { Timeline } from '../../taiga-api/timelines'
import { PageBody, PageHeader } from '../Layout'
import PageTitle from '../PageTitle'
import YourWorkItem from './YourWorkItem'

interface Props {
    title?: string
    description?: string
    avatarUrl?: string
    timeline: Timeline[]
    isLoading?: boolean
}

const YourWork = ({
    title,
    description,
    avatarUrl,
    timeline,
    isLoading,
}: Props) => {
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
                    <List style={{ width: '100%' }}>
                        {timeline?.map((item) => (
                            <YourWorkItem key={item.id} item={item} />
                        ))}
                    </List>
                </Skeleton>
            </PageBody>
        </div>
    )
}

export default YourWork
