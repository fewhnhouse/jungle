import { Empty, List, Skeleton } from 'antd'
import Link from 'next/link'
import styled from 'styled-components'
import { Timeline } from '../../taiga-api/timelines'
import ActivityListItem from './ActivityListItem'

const Container = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1;
    margin-bottom: ${({ theme }) => theme.spacing.big};
    width: 100%;
`

interface Props {
    title?: string
    activity: Timeline[]
    isLoading?: boolean
    href?: string
    limit?: number
}

export default function LimitedActivity({
    title,
    activity,
    isLoading,
    href,
    limit = 10,
}: Props) {
    return (
        <Container>
            <h2>{title}</h2>
            <Skeleton active paragraph={{ rows: 5 }} loading={isLoading}>
                <List
                    dataSource={
                        activity?.filter((_, index) => index < limit) ?? []
                    }
                    renderItem={(item) => (
                        <ActivityListItem key={item.id} activityItem={item} />
                    )}
                >
                    {!activity?.length && (
                        <Empty description="No activity yet." />
                    )}
                </List>
            </Skeleton>

            {href && activity?.length > limit && (
                <Link href={href}>See all activity</Link>
            )}
        </Container>
    )
}
