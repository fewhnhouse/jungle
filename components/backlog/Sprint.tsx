import CustomCollapse from '../Collapse'
import { queryCache } from 'react-query'
import { deleteMilestone, Milestone } from '../../taiga-api/milestones'
import IssueList from '../dnd/List'

const Sprint = ({ sprint }: { sprint: Milestone }) => {
    const handleRemove = async () => {
        queryCache.setQueryData('milestones', (oldMilestones: Milestone[]) =>
            oldMilestones.filter((m) => m.id !== sprint.id)
        )
        await deleteMilestone(sprint.id)
    }
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
                issues={sprint.user_stories}
            />
        </CustomCollapse>
    )
}

export default Sprint
