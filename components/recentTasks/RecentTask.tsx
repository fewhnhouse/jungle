import { BookOutlined, ProfileOutlined } from '@ant-design/icons'
import { Card } from 'antd'
import Link from 'next/link'
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
    projectName: string
    projectId: number
}
export default function RecentTask({
    type,
    title,
    description,
    id,
    projectName,
    projectId,
}: Props) {
    return (
        <StyledCard>
            <Meta
                avatar={
                    type === 'task' ? (
                        <StyledTaskIcon />
                    ) : (
                        <StyledUserStoryIcon />
                    )
                }
                title={
                    <Link href={`/project/${projectId}/${type}/${id}`}>
                        {title}
                    </Link>
                }
                description={
                    <div>
                        {projectName}
                        <br />
                        {description}
                    </div>
                }
            />
        </StyledCard>
    )
}
