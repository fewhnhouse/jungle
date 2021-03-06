import { Empty, List, Skeleton } from 'antd'
import Link from 'next/link'
import styled from 'styled-components'
import { Timeline } from '../../taiga-api/timelines'
import RecentTask from './YourWorkItem'

const Container = styled.div`
    flex: 1;
    margin-bottom: ${({ theme }) => theme.spacing.big};
    width: 100%;
`
interface Props {
    timeline?: Timeline[]
    title: string
    limit: number
    isLoading?: boolean
    href?: string
}

export default function RecentTasks({
    timeline = [],
    title,
    limit = 10,
    isLoading,
    href,
}: Props) {
    return (
        <Container>
            <h2>{title}</h2>
            <Skeleton active paragraph={{ rows: 5 }} loading={isLoading}>
                <List
                    style={{ width: '100%' }}
                    dataSource={
                        timeline?.filter((_, index) => index < limit) ?? []
                    }
                    renderItem={(item) => (
                        <RecentTask key={item.id} item={item} />
                    )}
                >
                    {!timeline?.length && (
                        <Empty description="No recent work items found." />
                    )}
                </List>
            </Skeleton>
            {href && timeline?.length > limit && (
                <Link href={href}>See all work items</Link>
            )}
        </Container>
    )
}
