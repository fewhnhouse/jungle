import {
    Card,
    CardHeader,
    CardTitle,
    CardBody,
    CardFooter,
    Button,
} from 'shards-react'
import styled from 'styled-components'
import ListItem from '../../components/ListItem'

const Container = styled.div`
    margin: 10px;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    height: 100%;
    align-items: center;
`

const StyledCard = styled(Card)`
    flex: 1;
    margin: 16px;
    min-width: 500px;
`

const StyledFooter = styled(CardFooter)`
    display: flex;
    justify-content: flex-end;
`

const ScrollableCardBody = styled(CardBody)`
    max-height: 300px;
    overflow: auto;
`

const List = styled.ul`
    margin: 0px;
    padding: 0px;
`

const StyledButton = styled(Button)`
    margin: 0px 5px;
`

export default function Home() {
    return (
        <Container>
            <StyledCard>
                <CardHeader>Projects</CardHeader>
                <ScrollableCardBody>
                    <List>
                        <ListItem>Project X</ListItem>
                        <ListItem>Project X</ListItem>
                        <ListItem>Project X</ListItem>
                        <ListItem>Project X</ListItem>
                        <ListItem>Project X</ListItem>
                        <ListItem>Project X</ListItem>
                        <ListItem>Project X</ListItem>
                    </List>
                </ScrollableCardBody>
                <StyledFooter>
                    <StyledButton outline>Create &rarr;</StyledButton>
                    <StyledButton outline theme="dark">
                        See all &rarr;
                    </StyledButton>
                </StyledFooter>
            </StyledCard>
            <StyledCard>
                <CardHeader>Your Work</CardHeader>
                <ScrollableCardBody>
                    <List>
                        <ListItem>Task X</ListItem>
                        <ListItem>Task X</ListItem>
                        <ListItem>Task X</ListItem>
                        <ListItem>Task X</ListItem>
                        <ListItem>Task X</ListItem>
                        <ListItem>Task X</ListItem>
                        <ListItem>Task X</ListItem>
                    </List>
                </ScrollableCardBody>
                <StyledFooter>
                    <StyledButton outline theme="dark">
                        See all &rarr;
                    </StyledButton>
                </StyledFooter>
            </StyledCard>
            <StyledCard>
                <CardHeader>Activity</CardHeader>
                <CardBody>
                    <CardTitle>Lorem Ipsum</CardTitle>
                    <p>Lorem ipsum dolor sit amet.</p>
                </CardBody>
                <StyledFooter>
                    <StyledButton outline theme="dark">
                        See all &rarr;
                    </StyledButton>
                </StyledFooter>
            </StyledCard>
        </Container>
    )
}
