import { List, Skeleton } from 'antd'
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
}

export default function RecentTasks({
    timeline = [],
    title,
    limit = 10,
    isLoading,
}: Props) {
    return (
        <Container>
            <h2>{title}</h2>
            <Skeleton active paragraph={{ rows: 5 }} loading={isLoading}>
                <List style={{ width: '100%' }}>
                    {timeline
                        ?.filter((_, index) => index < limit)
                        .map((item) => (
                            <RecentTask key={item.id} item={item} />
                        ))}
                </List>
            </Skeleton>
        </Container>
    )
}
