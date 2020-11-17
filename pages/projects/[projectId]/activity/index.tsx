import { useRouter } from 'next/router'
import { useQuery } from 'react-query'
import Activity from '../../../../components/activity/Activity'
import { getProject } from '../../../../taiga-api/projects'
import { getProjectTimeline } from '../../../../taiga-api/timelines'

export default function ProejctActivity() {
    const { projectId } = useRouter().query
    const { data: project } = useQuery(
        ['project', { projectId }],
        (key, { projectId }) => getProject(projectId),
        { enabled: projectId }
    )

    const { data, isLoading } = useQuery(
        ['timeline', { projectId }],
        (key, { projectId }) => getProjectTimeline(projectId),
        { enabled: projectId }
    )

    return (
        <Activity
            activity={data ?? []}
            isLoading={isLoading}
            title="Project Activity"
            description={`All activity from ${project?.name}`}
            avatarUrl={project?.logo_big_url}
        />
    )
}
