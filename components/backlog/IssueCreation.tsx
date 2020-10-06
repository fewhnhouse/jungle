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
    background: #45aaf2;
    border-radius: 3px;
    padding: 2px;
    color: #2c3e50;
`

const StyledForm = styled(Form)`
    * {
        flex: 1;
    }
    margin: 10px 0px;
`

const IssueCreation = ({ milestone }: { milestone: number | null }) => {
    const [issueType, setIssueType] = useState<'task' | 'story'>('task')
    const { projectId } = useRouter().query

    const handleSubmit = async ({ subject }: { subject: string }) => {
        if (issueType === 'task') {
            await createTask({ subject, milestone, project: projectId })
        } else if (issueType === 'story') {
            await createUserstory({ subject, milestone, project: projectId })
        }
        if (!milestone) {
            queryCache.refetchQueries(['backlog', { projectId }])
        } else {
            queryCache.refetchQueries(['milestones', { projectId }])
        }
    }

    return (
        <StyledForm onFinish={handleSubmit} layout="inline">
            <Form.Item required>
                <Select
                    value={issueType}
                    onChange={(val) => setIssueType(val)}
                    style={{ width: 120 }}
                >
                    <Select.Option value="task">
                        <StyledTaskIcon /> Task
                    </Select.Option>
                    <Select.Option value="story">
                        <StyledUserStoryIcon /> Story
                    </Select.Option>
                </Select>
            </Form.Item>

            <Form.Item name="subject">
                <Input />
            </Form.Item>
            <Form.Item>
                <Button htmlType="submit" icon={<PlusOutlined />}></Button>
            </Form.Item>
        </StyledForm>
    )
}

export default IssueCreation
