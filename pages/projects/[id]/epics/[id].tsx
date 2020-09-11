import { useRouter } from 'next/router'

const Epic = () => {
    const { id } = useRouter().query
    return <div>Epic: {id}</div>
}

export default Epic
