import { useRouter } from 'next/router'

const Task = () => {
    const { id } = useRouter().query
    return <div>Task: {id}</div>
}

export default Task
