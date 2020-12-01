import { Divider } from 'antd'
import Flex from '../../Flex'
import StoryStatuses from './StoryStatuses'
import TaskStatuses from './TaskStatuses'

const Statuses = () => {
    return (
        <Flex direction="column">
            <TaskStatuses />
            <Divider />
            <StoryStatuses />
        </Flex>
    )
}

export default Statuses
