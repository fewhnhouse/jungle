import styled from 'styled-components'
import ActivityListItem from './ActivityListItem'

const Container = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1;
    margin-bottom: ${({ theme }) => theme.spacing.big};
`

const Title = styled.h3``

export default function Activities() {
    return (
        <Container>
            <Title>Your recent Activity</Title>
            <ActivityListItem type="create" issue="ID-2001"></ActivityListItem>
            <ActivityListItem type="move" issue="ID-2001"></ActivityListItem>
            <ActivityListItem type="edit" issue="ID-2001"></ActivityListItem>
            <ActivityListItem type="delete" issue="ID-2001"></ActivityListItem>
            <ActivityListItem type="create" issue="ID-2001"></ActivityListItem>
        </Container>
    )
}
