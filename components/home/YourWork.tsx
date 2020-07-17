import YourWorkItem from './YourWorkItem'
import styled from 'styled-components'

const Container = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1;
`

const Title = styled.h3`
    width: 100%;
`

export default function YourWork() {
    return (
        <Container>
            <Title>Your work</Title>
            <YourWorkItem></YourWorkItem>
            <YourWorkItem></YourWorkItem>
            <YourWorkItem></YourWorkItem>
            <YourWorkItem></YourWorkItem>
            <YourWorkItem></YourWorkItem>
        </Container>
    )
}
