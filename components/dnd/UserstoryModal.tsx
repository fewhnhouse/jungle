import React from 'react'
import styled from 'styled-components'
import { queryCache, useQuery } from 'react-query'
import AssigneeDropdown from '../AssigneeDropdown'
import StatusDropdown from '../StatusDropdown'
import {
    getFiltersData,
    getUserstory,
    updateUserstory,
    UserStory,
} from '../../taiga-api/userstories'
import SubtaskList from './SubtaskList'
import CustomTagPicker from '../TagPicker'
import { useRouter } from 'next/router'
import { Divider, Menu, Skeleton } from 'antd'
import { BookOutlined, DeleteOutlined, UserOutlined } from '@ant-design/icons'
import Uploader from '../Uploader'
import MultiStorypointSelect from './MultiStorypointSelect'
import IssueModal from './IssueModal'

const Label = styled.span`
    margin-top: ${({ theme }) => theme.spacing.mini};
`

interface Props {
    open: boolean
    onClose: () => void
    id: number
}

const menu = (
    <Menu>
        <Menu.Item key="1" icon={<BookOutlined />}>
            Convert to Userstory
        </Menu.Item>
        <Menu.Item key="3" icon={<UserOutlined />}>
            Move
        </Menu.Item>
        <Menu.Item key="3" icon={<UserOutlined />}>
            Clone
        </Menu.Item>
        <Menu.Item key="3" icon={<UserOutlined />}>
            Change Parent
        </Menu.Item>
        <Menu.Item key="2" icon={<DeleteOutlined />}>
            Delete Task
        </Menu.Item>
    </Menu>
)

export default function UserstoryModal({ id, open, onClose }: Props) {
    const { projectId } = useRouter().query
    const { isLoading, data, isError } = useQuery(
        ['userstory', { id }],
        (key, { id }) => getUserstory(id),
        { enabled: open }
    )
    const { data: storyFilters } = useQuery(
        ['storyFilters', { projectId }],
        (key, { projectId }) => getFiltersData(projectId as string),
        { enabled: projectId }
    )
    const statusData =
        storyFilters?.statuses.map((status) => ({
            value: status.id,
            label: status.name,
        })) ?? []

    if (isError) return <div>Error</div>

    const updateAssignee = async (assigneeId: number) => {
        const updatedStory = await updateUserstory(id, {
            assigned_to: assigneeId,
            assigned_users: [assigneeId],
            version: data.version,
        })
        queryCache.setQueryData(['userstory', { id }], () => updatedStory)
    }

    const updateStatus = async (status: number) => {
        const updatedStory = await updateUserstory(id, {
            status,
            version: data.version,
        })
        queryCache.setQueryData(['userstory', { id }], () => updatedStory)
    }

    const handleTitleSubmit = async (subject: string) => {
        queryCache.setQueryData(['userstory', { id }], (prevData: UserStory) => ({
            ...prevData,
            subject,
        }))

        await updateUserstory(id, {
            subject,
            version: data.version,
        })
        queryCache.invalidateQueries(['backlog', { projectId }])
        queryCache.invalidateQueries(['milestones', { projectId }])
    }

    return (
        <IssueModal
            id={id}
            open={open}
            onClose={onClose}
            type="userstory"
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
                    <CustomTagPicker type="userstory" id={id} />
                    <Label>Story Points</Label>
                    <MultiStorypointSelect data={data} />
                </Skeleton>
            }
            innerContent={
                <Skeleton loading={isLoading} active>
                    <Uploader
                        // action={`${process.env.NEXT_PUBLIC_TAIGA_API_URL}/tasks/attachments`}
                        data={{
                            object_id: data?.id,
                            project: data?.project,
                        }}
                    />
                </Skeleton>
            }
            outerContent={
                <>
                    <SubtaskList id={id} />
                </>
            }
            actions={menu}
        />
    )
}
