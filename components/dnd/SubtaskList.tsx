import React from 'react'
import styled from 'styled-components'
import { queryCache, useQuery } from 'react-query'
import { getTasks, createTask, Task, deleteTask } from '../../taiga-api/tasks'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { Button, Form, Input, Popconfirm, Skeleton, Tag } from 'antd'
import {
    DeleteOutlined,
    PlusOutlined,
    ProfileOutlined,
} from '@ant-design/icons'
import { Store } from 'antd/lib/form/interface'

const TaskList = styled.ul`
    list-style: none;
    width: 100%;
    padding: 0;
    margin: 0;
`

const StyledTaskIcon = styled(ProfileOutlined)`
    display: block;
    background: #45aaff;
    border-radius: 3px;
    font-size: 20px;
    padding: 5px;
    color: #2c3e50;
    margin-right: 5px;
`

const StyledInput = styled(Input)`
    flex: 1;
`

const StyledFormItem = styled(Form.Item)`
    width: 100%;
    margin-right: 10px;
    margin-bottom: 0px;
`

const StyledForm = styled(Form)`
    width: 100%;
    display: flex;
    justify-content: space-between;
`

const TaskItem = styled.li`
    border-radius: 2px;
    display: flex;
    align-items: center;
    border: 2px solid transparent;
    background-color: #ecf0f1;
    box-sizing: border-box;
    padding: ${({ theme }) => `${theme.spacing.mini}`};
    margin-bottom: ${({ theme }) => `${theme.spacing.mini}`};
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

const TaskSubject = styled.a`
    margin: 0px 10px;
    color: #333;
    &:hover {
        color: black;
    }
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

    const handleFinish = (values: Store) => {
        form.validateFields().then(() => {
            console.log(values)
            form.resetFields()
            createTask({
                assigned_to: null,
                project: projectId,
                // TODO status: 16,
                subject: values.name,
                user_story: id,
            }).then((newTask) => {
                queryCache.setQueryData(
                    ['subtasks', { id }],
                    (prevData: Task[]) => [...prevData, newTask]
                )
            })
        })
    }

    const handleDelete = (id: number) => async () => {
        await deleteTask(id)
        queryCache.invalidateQueries(['subtasks', { id }])
    }

    return (
        <TaskList>
            {isTasksLoading ? (
                <Skeleton active paragraph={{ rows: 2 }} />
            ) : (
                <>
                    {subtasks?.map((task) => (
                        <TaskItem key={task.id}>
                            <Flex>
                                <StyledTaskIcon />
                                <TaskContent>
                                    <Link
                                        key={task.id}
                                        href={`/projects/${projectId}/tasks/${id}`}
                                    >
                                        <TaskSubject>
                                            {task.subject}
                                        </TaskSubject>
                                    </Link>
                                    <TagContainer>
                                        {task.assigned_to_extra_info && (
                                            <Tag>
                                                {
                                                    task.assigned_to_extra_info
                                                        .full_name_display
                                                }
                                            </Tag>
                                        )}
                                        <Tag>{task.status_extra_info.name}</Tag>
                                        <Tag>
                                            ID-
                                            {task.id}
                                        </Tag>
                                        <Popconfirm
                                            title="Are you sure you want to delete this subtask?"
                                            onConfirm={handleDelete(task.id)}
                                        >
                                            <Button
                                                danger
                                                size="small"
                                                icon={<DeleteOutlined />}
                                            />
                                        </Popconfirm>
                                    </TagContainer>
                                </TaskContent>
                            </Flex>
                        </TaskItem>
                    ))}
                    <StyledForm
                        form={form}
                        initialValues={{ name: '' }}
                        layout="vertical"
                        onFinish={handleFinish}
                    >
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
