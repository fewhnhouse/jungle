import { Skeleton } from 'antd'
import Link from 'next/link'
import styled from 'styled-components'
import { Timeline } from '../../taiga-api/timelines'
import ActivityListItem from './ActivityListItem'

const Container = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1;
    margin-bottom: ${({ theme }) => theme.spacing.big};
    min-width: 400px;
    max-width: 500px;
    width: 100%;
`

const List = styled.ul`
    list-style: none;
    padding: 0;
    @media screen and (max-width: 400px) {
        width: 350px;
    }
`

const Title = styled.h2`
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
`

interface Props {
    title?: string
    activity: Timeline[]
    isLoading?: boolean
    href: string
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
            <Title>{title}</Title>
            {isLoading && <Skeleton active paragraph={{ rows: 5 }} />}
            <List>
                {activity
                    ?.filter((_, index) => index < 10)
                    .map((activityItem) => (
                        <ActivityListItem
                            key={activityItem.id}
                            activityItem={activityItem}
                        ></ActivityListItem>
                    ))}
            </List>
            {activity?.length > limit && (
                <Link href={href}>See all activity</Link>
            )}
        </Container>
    )
}
