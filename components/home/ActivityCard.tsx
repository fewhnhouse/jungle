import styled from 'styled-components'
import ActivityListItem from './ActivityListItem'

const Container = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1;
`

const Title = styled.h3``

export default function ActivityCard() {
    return (
        <Container>
            <Title>Your recent Activity</Title>
            <ActivityListItem></ActivityListItem>
            <ActivityListItem></ActivityListItem>
            <ActivityListItem></ActivityListItem>
            <ActivityListItem></ActivityListItem>
            <ActivityListItem></ActivityListItem>
        </Container>
    )
}
