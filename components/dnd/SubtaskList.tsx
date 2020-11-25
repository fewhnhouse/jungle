import React from 'react'
import styled from 'styled-components'
import { queryCache, useQuery } from 'react-query'
import { getTasks, createTask, Task, deleteTask } from '../../taiga-api/tasks'
import { useRouter } from 'next/router'
import Link from 'next/link'
import {
    Avatar,
    Button,
    Form,
    Input,
    List,
    Popconfirm,
    Skeleton,
    Tag,
} from 'antd'
import {
    DeleteOutlined,
    LinkOutlined,
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

const Meta = styled(List.Item.Meta)`
    align-items: center;
`

const Item = styled(List.Item)`
    padding: 8px 0px !important;
`

const TitleBlock = styled.span`
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin: 0;
    display: block;
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
                    <List style={{ width: '100%' }} size="small">
                        {subtasks?.map((task) => (
                            <Item
                                key={task.id}
                                actions={[
                                    <Link
                                        key="link"
                                        href={`/projects/${projectId}/tasks/${task.id}`}
                                        passHref
                                    >
                                        <Button
                                            size="small"
                                            icon={<LinkOutlined />}
                                        />
                                    </Link>,
                                    <Popconfirm
                                        key="delete"
                                        title="Are you sure you want to delete this subtask?"
                                        onConfirm={handleDelete(task.id)}
                                    >
                                        <Button
                                            size="small"
                                            danger
                                            icon={<DeleteOutlined />}
                                        />
                                    </Popconfirm>,
                                ]}
                            >
                                <Meta
                                    avatar={
                                        <Avatar
                                            style={{
                                                backgroundColor: '#45aaff',
                                            }}
                                            shape="square"
                                            icon={<ProfileOutlined />}
                                        />
                                    }
                                    title={
                                        <TitleBlock>{task.subject}</TitleBlock>
                                    }
                                    description={
                                        <>
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
                                        </>
                                    }
                                />
                            </Item>
                        ))}
                    </List>
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
