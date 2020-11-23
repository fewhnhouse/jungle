import { useRouter } from 'next/router'

const Story = () => {
    const { id } = useRouter().query
    return <div>Story: {id}</div>
}

export default Story
