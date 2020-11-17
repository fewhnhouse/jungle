import { BookOutlined, ProfileOutlined } from '@ant-design/icons'
import { Avatar, Card } from 'antd'
import Link from 'next/link'
import { useRouter } from 'next/router'
import styled from 'styled-components'

const StyledUserStoryIcon = styled(BookOutlined)`
    background: #2ecc71;
    border-radius: 3px;
    padding: 5px;
    color: #2c3e50;
`

const StyledTaskIcon = styled(ProfileOutlined)`
    background: #45aaff;
    border-radius: 3px;
    padding: 5px;
    color: #2c3e50;
`

const StyledCard = styled(Card)`
    min-width: 300px;
    max-width: 500px;
    background: white;
    width: 100%;
    margin: ${({ theme }) => `${theme.spacing.medium} 0px`};
`

const { Meta } = Card

interface Props {
    type: 'userstory' | 'task'
    title: string
    description?: string
    id: number
}
export default function RecentTask({ type, title, description, id }: Props) {
    const { projectId } = useRouter().query
    return (
        <Link passHref href={`/project/${projectId}/${type}/${id}`}>
            <StyledCard hoverable>
                <Meta
                    avatar={
                        type === 'task' ? (
                            <StyledTaskIcon />
                        ) : (
                            <StyledUserStoryIcon />
                        )
                    }
                    title={title}
                    description={description}
                />
            </StyledCard>
        </Link>
    )
}
