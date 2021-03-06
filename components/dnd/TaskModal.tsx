import React from 'react'
import styled from 'styled-components'
import { useQueryCache, useQuery } from 'react-query'
import {
    deleteTask,
    getFiltersData,
    getTask,
    promoteToUserstory,
    Task,
    updateTask,
} from '../../taiga-api/tasks'
import SingleAssigneeDropdown from '../issues/SingleAssigneeDropdown'
import StatusDropdown from '../issues/StatusDropdown'
import { useRouter } from 'next/router'
import { Menu, Modal, Skeleton } from 'antd'
import {
    BookOutlined,
    DeleteOutlined,
    ExclamationCircleOutlined,
    UserOutlined,
} from '@ant-design/icons'
import Uploader from '../issues/Uploader'
import IssueModal from './IssueModal'
import CustomTagPicker from '../issues/TagPicker'
import { updateTaskCache } from '../../updateCache'

const Label = styled.span`
    margin-top: ${({ theme }) => theme.spacing.mini};
`

interface Props {
    open: boolean
    onClose: () => void
    id: number
}

const { confirm } = Modal

export default function TaskModal({ id, open, onClose }: Props) {
    const { projectId } = useRouter().query
    const queryCache = useQueryCache()

    const { isLoading, data, isError } = useQuery(
        ['task', { id }],
        (key, { id }) => getTask(id),
        { enabled: open }
    )

    const { data: taskFilters } = useQuery(
        ['taskFilters', { projectId }],
        (key, { projectId }) => getFiltersData(projectId as string),
        { enabled: projectId }
    )

    const handleDelete = () => {
        confirm({
            title: 'Are you sure you want to delete this task?',
            icon: <ExclamationCircleOutlined />,
            centered: true,
            content: 'Deleting a task is irreversible.',
            onOk: async () => {
                await deleteTask(id)
                queryCache.invalidateQueries([
                    'tasks',
                    { projectId, milestone: data?.id },
                ])
                queryCache.setQueryData(
                    ['tasks', { projectId }],
                    (prevData: Task[]) =>
                        prevData?.filter((task) => task.id !== id)
                )
                onClose()
            },
        })
    }

    const handleConvert = async () => {
        await promoteToUserstory(id, projectId as string)
        queryCache.invalidateQueries(['tasks', { projectId }])
        queryCache.invalidateQueries(['userstories', { projectId }])
        onClose()
    }
    const menu = (
        <Menu>
            <Menu.Item onClick={handleConvert} key="1" icon={<BookOutlined />}>
                Convert to Userstory
            </Menu.Item>
            <Menu.Item key="2" icon={<UserOutlined />}>
                Change Parent
            </Menu.Item>
            <Menu.Item onClick={handleDelete} key="3" icon={<DeleteOutlined />}>
                Delete Task
            </Menu.Item>
        </Menu>
    )

    const statusData =
        taskFilters?.statuses.map((status) => ({
            value: status.id,
            label: status.name,
        })) ?? []

    const updateAssignee = async (assigneeId?: number) => {
        const updatedTask = await updateTask(id, {
            assigned_to: assigneeId ?? null,
            assigned_users: assigneeId ? [assigneeId] : [],
            version: data.version,
        })
        updateTaskCache(updatedTask, id, projectId as string, queryCache)
    }

    const updateStatus = async (status: number) => {
        const updatedTask = await updateTask(id, {
            status,
            version: data.version,
        })
        updateTaskCache(updatedTask, id, projectId as string, queryCache)
    }

    if (isError) return <div>Error</div>

    return (
        <IssueModal
            id={id}
            open={open}
            onClose={onClose}
            type="task"
            sidebar={
                <Skeleton loading={isLoading} active>
                    <Label>Status</Label>
                    <StatusDropdown
                        data={statusData}
                        value={data?.status}
                        onChange={updateStatus}
                    />
                    <Label>Assignee</Label>
                    <SingleAssigneeDropdown
                        value={data?.assigned_to}
                        onChange={updateAssignee}
                    />
                    <Label>Tags</Label>
                    <CustomTagPicker type="task" id={id} />
                </Skeleton>
            }
            outerContent={[
                {
                    label: 'Files',
                    content: (
                        <Skeleton loading={isLoading} active>
                            <Uploader
                                type="task"
                                action={`${process.env.NEXT_PUBLIC_TAIGA_API_URL}/tasks/attachments`}
                                data={{
                                    object_id: data?.id,
                                    project: data?.project,
                                }}
                            />
                        </Skeleton>
                    ),
                },
            ]}
            actions={menu}
        />
    )
}
