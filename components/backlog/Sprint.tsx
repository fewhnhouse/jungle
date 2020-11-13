import CustomCollapse from '../Collapse'
import { queryCache, useQuery } from 'react-query'
import { deleteMilestone, Milestone } from '../../taiga-api/milestones'
import IssueList from '../dnd/List'
import { getTasks } from '../../taiga-api/tasks'
import { useRouter } from 'next/router'

const Sprint = ({ sprint }: { sprint: Milestone }) => {
    const { projectId } = useRouter().query

    const handleRemove = async () => {
        queryCache.setQueryData(
            ['milestones', { projectId }],
            (oldMilestones: Milestone[]) =>
                oldMilestones.filter((m) => m.id !== sprint.id)
        )
        await deleteMilestone(sprint.id)
    }

    const { data: tasks = [] } = useQuery(
        ['tasks', { projectId, milestone: sprint.id }],
        async (key, { projectId, milestone }) => {
            const tasks = await getTasks({ projectId, milestone })
            return tasks.filter((t) => t.user_story === null)
        }
    )

    const startDate = new Date(sprint.estimated_start)
    const endDate = new Date(sprint.estimated_finish)
    const today = new Date()

    return (
        <CustomCollapse
            actions={[{ title: 'Remove Sprint', action: handleRemove }]}
            key={sprint.id}
            title={sprint.name}
            description={`${startDate.toLocaleDateString()}-${endDate.toLocaleDateString()}`}
            active={startDate <= today && today <= endDate}
        >
            <IssueList
                style={{ minHeight: 100 }}
                listId={sprint.id.toString()}
                issues={[...sprint.user_stories, ...tasks]}
            />
        </CustomCollapse>
    )
}

export default Sprint
