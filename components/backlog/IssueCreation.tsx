import { Button, Input, Select } from 'antd'
import { BookOutlined, PlusOutlined, ProfileOutlined } from '@ant-design/icons'
import styled from 'styled-components'
import { useState } from 'react'
import { createTask, Task } from '../../taiga-api/tasks'
import { useRouter } from 'next/router'
import { createUserstory, UserStory } from '../../taiga-api/userstories'
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
            const createdTask = await createTask({
                subject,
                milestone,
                project: projectId,
            })
            queryCache.setQueryData(
                ['tasks', { projectId }],
                (prevData: Task[]) =>
                    prevData ? [...prevData, createdTask] : [createdTask]
            )
        } else if (issueType === 'story') {
            const createdStory = await createUserstory({
                subject,
                milestone,
                project: projectId,
            })
            queryCache.setQueryData(
                ['userstories', { projectId }],
                (prevData: UserStory[]) =>
                    prevData ? [...prevData, createdStory] : [createdStory]
            )
        }
    }

    return (
        <StyledForm onSubmit={handleSubmit}>
            <Select
                value={issueType}
                onChange={(val) => setIssueType(val)}
                style={{ width: 100 }}
            >
                <Select.Option value="task">
                    <StyledTaskIcon /> Task
                </Select.Option>
                <Select.Option value="story">
                    <StyledUserStoryIcon /> Story
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
