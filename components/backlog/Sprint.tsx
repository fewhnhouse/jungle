import CustomCollapse from '../Collapse'
import IssueList from './IssueList'
import { IMilestone } from '../../interfaces/Project'

const Sprint = ({ sprint }: { sprint: IMilestone }) => {
    return (
        <CustomCollapse key={sprint.id} title="Current Sprint">
            <IssueList listId="1" issues={sprint.user_stories} />
        </CustomCollapse>
    )
}

export default Sprint