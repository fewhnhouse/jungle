import { useRouter } from 'next/router'
import { useQuery } from 'react-query'
import PageTitle from '../../../components/PageTitle'
import { getProject } from '../../../taiga-api/projects'

export default function Settings() {
    const { projectId } = useRouter().query

    const { data: project } = useQuery(
        ['project', { projectId }],
        (key, { projectId }) => getProject(projectId as string),
        { enabled: projectId }
    )

    return (
        <div>
            <PageTitle title="Settings" description={`For Project ${project?.name}`} />
        </div>
    )
}
