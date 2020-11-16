import { Button, Form, Input, Select } from 'antd'
import { BookOutlined, PlusOutlined, ProfileOutlined } from '@ant-design/icons'
import styled from 'styled-components'
import { useState } from 'react'
import { createTask } from '../../taiga-api/tasks'
import { useRouter } from 'next/router'
import { createUserstory } from '../../taiga-api/userstories'
import { queryCache } from 'react-query'

const StyledUserStoryIcon = styled(BookOutlined)`
    background: #2ecc71;
    border-radius: 3px;
    padding: 2px;
    color: #2c3e50;
`

const StyledTaskIcon = styled(ProfileOutlined)`
    background: #45aaff;
    border-radius: 3px;
    padding: 2px;
    color: #2c3e50;
`

const StyledForm = styled.form`
    display: flex;
    input {
        flex: 1;
        margin: 0px 5px;
    }
    margin: 10px 0px;
`

const IssueCreation = ({ milestone }: { milestone: number | null }) => {
    const [issueType, setIssueType] = useState<'task' | 'story'>('story')
    const [subject, setSubject] = useState('')
    const { projectId } = useRouter().query

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setSubject('')
        if (issueType === 'task') {
            await createTask({ subject, milestone, project: projectId })
        } else if (issueType === 'story') {
            await createUserstory({ subject, milestone, project: projectId })
        }
        if (!milestone) {
            queryCache.invalidateQueries(['backlog', { projectId }])
        } else {
            queryCache.invalidateQueries(['milestones', { projectId }])
        }
        queryCache.invalidateQueries(['tasks', { projectId, milestone }])
    }

    return (
        <StyledForm onSubmit={handleSubmit}>
            <Select
                value={issueType}
                onChange={(val) => setIssueType(val)}
                style={{ width: 60 }}
            >
                <Select.Option value="task">
                    <StyledTaskIcon />
                </Select.Option>
                <Select.Option value="story">
                    <StyledUserStoryIcon />
                </Select.Option>
            </Select>

            <Input
                placeholder={`Create ${issueType}...`}
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
            />
            <Button htmlType="submit" icon={<PlusOutlined />}></Button>
        </StyledForm>
    )
}

export default IssueCreation
