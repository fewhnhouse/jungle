import React, { useState } from 'react'
import styled from 'styled-components'
import { queryCache, useQuery } from 'react-query'
import {
    deleteTask,
    getFiltersData,
    getTask,
    promoteToUserstory,
    updateTask,
} from '../../taiga-api/tasks'
import AssigneeDropdown from '../AssigneeDropdown'
import StatusDropdown from '../StatusDropdown'
import { useRouter } from 'next/router'
import { Menu, Modal, Skeleton } from 'antd'
import {
    BookOutlined,
    DeleteOutlined,
    ExclamationCircleOutlined,
    UserOutlined,
} from '@ant-design/icons'
import Uploader from '../Uploader'
import IssueModal from './IssueModal'
import CustomTagPicker from '../TagPicker'

const Label = styled.span`
    margin-top: ${({ theme }) => theme.spacing.mini};
`

interface Props {
    open: boolean
    onClose: () => void
    id: number
}

interface ActionMenuProps {
    id: number
    milestone: number
    closeModal: () => void
}

const { confirm } = Modal

const ActionMenu = ({ id, milestone, closeModal }: ActionMenuProps) => {
    const { projectId } = useRouter().query
}

export default function TaskModal({ id, open, onClose }: Props) {
    const { projectId } = useRouter().query

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
            content: 'Some descriptions',
            onOk: async () => {
                await deleteTask(id)
                queryCache.invalidateQueries([
                    'tasks',
                    { projectId, milestone: data?.id },
                ])
                queryCache.invalidateQueries(['backlog', { projectId }])
                onClose()
            },
            onCancel() {
                console.log('Cancel')
            },
        })
    }

    const handleConvert = async () => {
        await promoteToUserstory(id, projectId as string)
        queryCache.invalidateQueries([
            'tasks',
            { projectId, milestone: data?.id },
        ])
        queryCache.invalidateQueries(['backlog', { projectId }])
        queryCache.invalidateQueries(['milestones', { projectId }])
        queryCache.invalidateQueries([
            'tasks',
            { projectId, milestone: data?.milestone },
        ])
        onClose()
    }
    const menu = (
        <Menu>
            <Menu.Item onClick={handleConvert} key="1" icon={<BookOutlined />}>
                Convert to Userstory
            </Menu.Item>
            <Menu.Item key="2" icon={<UserOutlined />}>
                Move
            </Menu.Item>
            <Menu.Item key="3" icon={<UserOutlined />}>
                Clone
            </Menu.Item>
            <Menu.Item key="4" icon={<UserOutlined />}>
                Change Parent
            </Menu.Item>
            <Menu.Item onClick={handleDelete} key="5" icon={<DeleteOutlined />}>
                Delete Task
            </Menu.Item>
        </Menu>
    )

    const statusData =
        taskFilters?.statuses.map((status) => ({
            value: status.id,
            label: status.name,
        })) ?? []

    const updateAssignee = async (assigneeId: number) => {
        const updatedTask = await updateTask(id, {
            assigned_to: assigneeId,
            assigned_users: [assigneeId],
            version: data.version,
        })
        queryCache.setQueryData(['task', { id }], () => updatedTask)
    }

    const updateStatus = async (status: number) => {
        const updatedTask = await updateTask(id, {
            status,
            version: data.version,
        })
        queryCache.setQueryData(['task', { id }], () => updatedTask)
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
                    <AssigneeDropdown
                        value={data?.assigned_to}
                        onChange={updateAssignee}
                    />
                    <Label>Tags</Label>
                    <CustomTagPicker type="task" id={id} />
                </Skeleton>
            }
            outerContent={
                <Skeleton loading={isLoading} active>
                    <Uploader
                        data={{
                            object_id: data?.id,
                            project: data?.project,
                        }}
                    />
                </Skeleton>
            }
            actions={menu}
        />
    )
}
