import CustomCollapse from '../Collapse'
import IssueList from './IssueList'
import { IMilestone } from '../../interfaces/Project'
import authInstance from '../../util/axiosInstance'
import { queryCache } from 'react-query'

const Sprint = ({ sprint }: { sprint: IMilestone }) => {
    const handleRemove = async () => {
        queryCache.setQueryData('milestones', (oldMilestones: IMilestone[]) =>
            oldMilestones.filter((m) => m.id !== sprint.id)
        )
        await authInstance.delete(`/milestones/${sprint.id}`)
    }
    return (
        <CustomCollapse
            actions={[{ title: 'Remove Sprint', action: handleRemove }]}
            key={sprint.id}
            title={sprint.name}
        >
            <IssueList
                listId={sprint.id.toString()}
                issues={sprint.user_stories}
            />
        </CustomCollapse>
    )
}

export default Sprint
