import Link from 'next/link'
import { useQuery } from 'react-query'
import styled from 'styled-components'
import { getUserTimeline } from '../../taiga-api/timelines'
import { getMe } from '../../taiga-api/users'
import ActivityListItem from './ActivityListItem'

const Container = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1;
    margin-bottom: ${({ theme }) => theme.spacing.big};
`

const Title = styled.h3`
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
`

export default function Activities() {
    const { data: me } = useQuery('me', () => getMe())

    const { data } = useQuery(['timeline', { id: me?.id }], (key, { id }) =>
        getUserTimeline(id)
    )
    return (
        <Container>
            <Title>Your recent Activity</Title>
            {data
                ?.filter((_, index) => index < 10)
                .map((activityItem) => (
                    <ActivityListItem
                        key={activityItem.id}
                        activityItem={activityItem}
                    ></ActivityListItem>
                ))}
            {data?.length > 10 && (
                <Link href="/activity">See all activity</Link>
            )}
        </Container>
    )
}
