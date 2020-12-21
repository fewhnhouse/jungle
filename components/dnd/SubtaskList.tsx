import React from 'react'
import styled from 'styled-components'
import { useQueryCache, useQuery } from 'react-query'
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
import useMedia from 'use-media'

const TaskList = styled.div`
    width: 100%;
`

const StyledInput = styled(Input)`
    flex: 1;
`

const StyledFormItem = styled(Form.Item)`
    flex: 1 !important;
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

const StyledList = styled(List)`
    margin-bottom: 5px !important;
`

const Item = styled(List.Item)`
    &:hover {
        background: #eee;
    }
    border-radius: 2px;
    cursor: pointer;
`

const TitleBlock = styled.span`
    white-space: nowrap;
    font-size: 16px;
    font-weight: 400;
    overflow: hidden;
    text-overflow: ellipsis;
    margin: 0;
    display: block;
`

interface Props {
    id: number
}

const SubtaskList = ({ id }: Props) => {
    const { push, query } = useRouter()
    const { projectId } = query
    const [form] = Form.useForm()
    const queryCache = useQueryCache()
    const isMobile = useMedia('(max-width: 700px)')

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
                queryCache.setQueryData(
                    ['tasks', { projectId }],
                    (prevData: Task[]) => [...prevData, newTask]
                )
            })
        })
    }

    const navigate = (id: number) => () =>
        push(`/projects/${projectId}/tasks/${id}`)

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
                    <StyledList
                        dataSource={subtasks ?? []}
                        renderItem={(task: Task) => (
                            <Item
                                onClick={navigate(task.id)}
                                key={task.id}
                                actions={[
                                    task.assigned_to_extra_info && (
                                        <Tag key="assignedtag">
                                            {
                                                task.assigned_to_extra_info
                                                    .full_name_display
                                            }
                                        </Tag>
                                    ),
                                    <Tag key="statustag">
                                        {task.status_extra_info.name}
                                    </Tag>,
                                    <Tag key="idtag">
                                        ID-
                                        {task.id}
                                    </Tag>,
                                    <Link
                                        key="link"
                                        href={`/projects/${projectId}/tasks/${task.id}`}
                                        passHref
                                    >
                                        <Button
                                            size={isMobile ? 'middle' : 'small'}
                                            icon={<LinkOutlined />}
                                        />
                                    </Link>,
                                    <Popconfirm
                                        key="delete"
                                        title="Are you sure you want to delete this subtask?"
                                        onConfirm={handleDelete(task.id)}
                                    >
                                        <Button
                                            size={isMobile ? 'middle' : 'small'}
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
                                />
                            </Item>
                        )}
                    />
                    <StyledForm
                        form={form}
                        initialValues={{ name: '' }}
                        layout="inline"
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
                            <StyledInput
                                size={isMobile ? 'large' : 'middle'}
                                placeholder="Add Subtask..."
                            />
                        </StyledFormItem>
                        <Button
                            size={isMobile ? 'large' : 'middle'}
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
