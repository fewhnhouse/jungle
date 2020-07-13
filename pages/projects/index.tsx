import styled from 'styled-components'
import Link from 'next/link'

const Container = styled.div`
    display: flex;
    flex-direction: row;
    height: 100%;
    width: 100%;
`

const Projects = () => (
    <Container>
        <Link href="/projects/123">
            <a>Project 1</a>
        </Link>
    </Container>
)

export default Projects
