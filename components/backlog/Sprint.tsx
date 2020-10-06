import CustomCollapse from '../Collapse'
import { queryCache, useQuery } from 'react-query'
import { deleteMilestone, Milestone } from '../../taiga-api/milestones'
import IssueList from '../dnd/List'
import { getTasks } from '../../taiga-api/tasks'
import { useRouter } from 'next/router'

const Sprint = ({ sprint }: { sprint: Milestone }) => {
    const { projectId } = useRouter().query

    const handleRemove = async () => {
        queryCache.setQueryData('milestones', (oldMilestones: Milestone[]) =>
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
    return (
        <CustomCollapse
            actions={[{ title: 'Remove Sprint', action: handleRemove }]}
            key={sprint.id}
            title={sprint.name}
            description={`${new Date(
                sprint.estimated_start
            ).toLocaleDateString()}-${new Date(
                sprint.estimated_finish
            ).toLocaleDateString()}`}
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
