import React from 'react'
import styled from 'styled-components'
import { queryCache, useQuery } from 'react-query'
import AssigneeDropdown from '../AssigneeDropdown'
import StatusDropdown from '../StatusDropdown'
import {
    deleteUserstory,
    getFiltersData,
    getUserstory,
    updateUserstory,
} from '../../taiga-api/userstories'
import SubtaskList from './SubtaskList'
import CustomTagPicker from '../TagPicker'
import { useRouter } from 'next/router'
import { Menu, Modal, Skeleton } from 'antd'
import { DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import Uploader from '../Uploader'
import MultiStorypointSelect from './MultiStorypointSelect'
import IssueModal from './IssueModal'

const { confirm } = Modal

const Label = styled.span`
    margin-top: ${({ theme }) => theme.spacing.mini};
`

interface Props {
    open: boolean
    onClose: () => void
    id: number
}

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

    const handleDelete = () => {
        confirm({
            title: 'Are you sure you want to delete this story?',
            icon: <ExclamationCircleOutlined />,
            centered: true,
            content: 'Some descriptions',
            onOk: async () => {
                await deleteUserstory(id)
                queryCache.invalidateQueries(['milestones', { projectId }])
                queryCache.invalidateQueries(['backlog', { projectId }])
                onClose()
            },
            onCancel() {
                console.log('Cancel')
            },
        })
    }

    const menu = (
        <Menu>
            <Menu.Item onClick={handleDelete} key="4" icon={<DeleteOutlined />}>
                Delete Story
            </Menu.Item>
        </Menu>
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
