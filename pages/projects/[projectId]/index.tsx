import styled from 'styled-components'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { PageBody, PageHeader } from '../../../components/Layout'
import PageTitle from '../../../components/PageTitle'
import { useQuery } from 'react-query'
import { getProject } from '../../../taiga-api/projects'

const Container = styled.div`
    display: flex;
    flex-direction: row;
    height: 100%;
    width: 100%;
`

const Project = () => {
    const router = useRouter()
    const { projectId } = router.query

    const { data } = useQuery(
        ['project', { projectId }],
        (key, { projectId }) => getProject(projectId as string)
    )

    return (
        <>
            <PageHeader>
                <PageTitle
                    title={data?.name}
                    description={data?.description}
                />
            </PageHeader>
            <PageBody>
                <Link
                    href="/projects/[id]/board"
                    as={`/projects/${projectId}/board`}
                >
                    <a>Board</a>
                </Link>
                <Link
                    href="/projects/[id]/backlog"
                    as={`/projects/${projectId}/backlog`}
                >
                    <a>Backlog</a>
                </Link>
            </PageBody>
        </>
    )
}

export default Project
