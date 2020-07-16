import styled from 'styled-components'
import ActivityListItem from './ActivityListItem'

const Container = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1;
    margin: 40px;
`

export default function ActivityCard() {
    return (
        <Container>
            <ActivityListItem></ActivityListItem>
            <ActivityListItem></ActivityListItem>
            <ActivityListItem></ActivityListItem>
            <ActivityListItem></ActivityListItem>
            <ActivityListItem></ActivityListItem>
        </Container>
    )
}
