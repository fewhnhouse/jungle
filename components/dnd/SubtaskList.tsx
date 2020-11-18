import React from 'react'
import styled from 'styled-components'
import { queryCache, useQuery } from 'react-query'
import { getTasks, createTask, Task } from '../../taiga-api/tasks'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { Button, Form, Input, Skeleton, Tag } from 'antd'
import { PicLeftOutlined, PlusOutlined } from '@ant-design/icons'

const TaskList = styled.ul`
    list-style: none;
    width: 100%;
    padding: 0;
`

const StyledInput = styled(Input)`
    flex: 1;
`

const StyledFormItem = styled(Form.Item)`
    width: 100%;
    margin-right: 5px;
`

const StyledForm = styled(Form)`
    width: 100%;
    display: flex;
    justify-content: space-between;
`

const TaskItem = styled.li`
    border-radius: 2px;
    cursor: pointer;
    display: flex;
    align-items: center;
    border: 2px solid transparent;
    background-color: #ecf0f1;
    box-sizing: border-box;
    padding: ${({ theme }) => `${theme.spacing.mini}`};
    margin-bottom: ${({ theme }) => `${theme.spacing.mini}`};
    &:hover,
    &:active {
        color: #7f8c8d;
    }
    display: flex;
`

const Flex = styled.div`
    display: flex;
    align-items: center;
    width: 100%;
`

const TaskContent = styled.div`
    /* flex child */
    flex-grow: 1;
    flex-basis: 100%;
    align-items: center;
    justify-content: space-between;
    /* flex parent */
    display: flex;
    flex-direction: row;
`

const TaskSubject = styled.p`
    margin: 0px 10px;
`

const TagContainer = styled.div`
    display: flex;
    margin-top: ${({ theme }) => `${theme.spacing.mini}`};
    align-items: center;
`

interface Props {
    id: number
}

const SubtaskList = ({ id }: Props) => {
    const { projectId } = useRouter().query
    const [form] = Form.useForm()

    const { isLoading: isTasksLoading, data: subtasks } = useQuery(
        ['subtasks', { id }],
        (key, { id }) =>
            getTasks({
                projectId: projectId as string,
                userStory: id.toString(),
            }),

        { enabled: id && projectId }
    )

    const handleAddSubtask = (values: { name: string }) => {
        createTask({
            assigned_to: null,
            project: projectId,
            // TODO status: 16,
            subject: values.name,
            user_story: id,
        }).then((newTask) => {
            form.resetFields()
            queryCache.setQueryData(
                ['subtasks', { id }],
                (prevData: Task[]) => [...prevData, newTask]
            )
        })
    }

    return (
        <TaskList>
            {isTasksLoading ? (
                <Skeleton active paragraph={{ rows: 2 }} />
            ) : (
                <>
                    {subtasks?.map((task) => (
                        <TaskItem key={task.id}>
                            <Link
                                key={task.id}
                                href={`/projects/${projectId}/tasks/${id}`}
                            >
                                <Flex>
                                    <PicLeftOutlined />
                                    <TaskContent>
                                        <TaskSubject>
                                            {task.subject}
                                        </TaskSubject>
                                        <TagContainer>
                                            {task.assigned_to_extra_info && (
                                                <Tag>
                                                    {
                                                        task
                                                            .assigned_to_extra_info
                                                            .full_name_display
                                                    }
                                                </Tag>
                                            )}
                                            <Tag>
                                                {task.status_extra_info.name}
                                            </Tag>
                                            <Tag>
                                                ID-
                                                {task.id}
                                            </Tag>
                                        </TagContainer>
                                    </TaskContent>
                                </Flex>
                            </Link>
                        </TaskItem>
                    ))}
                    <StyledForm layout="vertical" onFinish={handleAddSubtask}>
                        <StyledFormItem
                            name="name"
                            rules={[
                                {
                                    required: true,
                                },
                            ]}
                        >
                            <StyledInput placeholder="Add Subtask..." />
                        </StyledFormItem>
                        <Button
                            htmlType="submit"
                            type="primary"
                            icon={<PlusOutlined />}
                        ></Button>
                    </StyledForm>
                </>
            )}
        </TaskList>
    )
}

export default SubtaskList
