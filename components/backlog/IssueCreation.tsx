import { Button, Input, Select } from 'antd'
import { BookOutlined, PlusOutlined, ProfileOutlined } from '@ant-design/icons'
import styled from 'styled-components'
import { useState } from 'react'
import { createTask, Task } from '../../taiga-api/tasks'
import { useRouter } from 'next/router'
import { createUserstory, UserStory } from '../../taiga-api/userstories'
import { useQueryCache } from 'react-query'
import useMedia from 'use-media'

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
    const queryCache = useQueryCache()
    const isMobile = useMedia('(max-width: 700px)')

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
                size={isMobile ? 'large' : 'middle'}
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
                size={isMobile ? 'large' : 'middle'}
                placeholder={`Create ${issueType}...`}
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
            />
            <Button
                size={isMobile ? 'large' : 'middle'}
                disabled={subject === ''}
                htmlType="submit"
                icon={<PlusOutlined />}
            ></Button>
        </StyledForm>
    )
}

export default IssueCreation
