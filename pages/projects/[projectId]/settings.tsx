import { useRouter } from 'next/router'
import { useQuery } from 'react-query'
import styled from 'styled-components'
import Flex from '../../../components/Flex'
import { PageBody, PageHeader } from '../../../components/Layout'
import PageTitle from '../../../components/PageTitle'
import { getProject } from '../../../taiga-api/projects'

const Menu = styled.nav`
    display: flex;
    flex-direction: column;
`

const Content = styled.div``

export default function Settings() {
    const { projectId } = useRouter().query

    const { data: project } = useQuery(
        ['project', { projectId }],
        (key, { projectId }) => getProject(projectId as string),
        { enabled: projectId }
    )

    return (
        <div>
            <PageHeader>
                <PageTitle
                    title="Settings"
                    description={`For Project ${project?.name}`}
                />
            </PageHeader>
            <PageBody>
                <Flex>
                    <Menu>nav</Menu>
                    <Content>content</Content>
                </Flex>
            </PageBody>
        </div>
    )
}
