import styled from 'styled-components'
import Link from 'next/link'
import { useRouter } from 'next/router'

const Container = styled.div`
    display: flex;
    flex-direction: row;
    height: 100%;
    width: 100%;
`

const Project = () => {
    const router = useRouter()
    const { id } = router.query

    return (
        <Container>
            <Link href="/projects/[id]/board" as={`/projects/${id}/board`}>
                <a>Board</a>
            </Link>
            <Link href="/projects/[id]/backlog" as={`/projects/${id}/backlog`}>
                <a>Backlog</a>
            </Link>
        </Container>
    )
}

export default Project
