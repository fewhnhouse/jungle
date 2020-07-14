import styled from 'styled-components'
import Link from 'next/link'
import {
    Card,
    CardHeader,
    FormInput,
    CardBody,
    CardFooter,
    Button,
    FormCheckbox,
} from 'shards-react'

const Container = styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
`

const StyledCard = styled(Card)`
    margin: 8px 16px;
`

const Projects = () => (
    <Container>
        <StyledCard>
            <CardBody>
                <Link href="/projects/123">
                    <a>Project 1</a>
                </Link>
            </CardBody>
        </StyledCard>
        <StyledCard>
            <CardBody>
                <Link href="/projects/123">
                    <a>Project 1</a>
                </Link>
            </CardBody>
        </StyledCard>
        <StyledCard>
            <CardBody>
                <Link href="/projects/123">
                    <a>Project 1</a>
                </Link>
            </CardBody>
        </StyledCard>
    </Container>
)

export default Projects
