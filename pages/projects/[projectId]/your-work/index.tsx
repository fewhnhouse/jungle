import { useRouter } from 'next/router'
import { useQuery } from 'react-query'
import YourWork from '../../../../components/your-work/YourWork'
import { getProject } from '../../../../taiga-api/projects'
import { getProjectTimeline, Timeline } from '../../../../taiga-api/timelines'
import { recentTaskFilter } from '../../../../util/recentTaskFilter'

export default function ProjectWork() {
    const { projectId } = useRouter().query
    const { data: project } = useQuery(
        ['project', { projectId }],
        (key, { projectId }) => getProject(projectId),
        { enabled: projectId }
    )

    const { data: timeline, isLoading } = useQuery(
        ['timeline', { projectId }],
        (key, { projectId }) => getProjectTimeline(projectId),
        { enabled: projectId }
    )

    const recentTasks: Timeline[] = recentTaskFilter(timeline)

    return (
        <YourWork
            timeline={recentTasks ?? []}
            isLoading={isLoading}
            title="Project Work Items"
            description={`All recent work items from ${project?.name}`}
            avatarUrl={project?.logo_big_url}
        />
    )
}
