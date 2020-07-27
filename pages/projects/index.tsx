import styled from 'styled-components'
import Link from 'next/link'
import { Panel } from 'rsuite'

const Container = styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
`

const StyledPanel = styled(Panel)`
    margin: 8px 16px;
    background: white;
`

const Projects = () => (
    <Container>
        <StyledPanel>
            <Link href="/projects/123">
                <a>Project 1</a>
            </Link>
        </StyledPanel>
        <StyledPanel>
            <Link href="/projects/123">
                <a>Project 1</a>
            </Link>
        </StyledPanel>
        <StyledPanel>
            <Link href="/projects/123">
                <a>Project 1</a>
            </Link>
        </StyledPanel>
    </Container>
)

export default Projects
