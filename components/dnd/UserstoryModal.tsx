import React from 'react'
import styled from 'styled-components'
import { useQueryCache, useQuery } from 'react-query'
import AssigneeDropdown from '../issues/AssigneeDropdown'
import StatusDropdown from '../issues/StatusDropdown'
import {
    deleteUserstory,
    getFiltersData,
    getUserstory,
    updateUserstory,
    UserStory,
} from '../../taiga-api/userstories'
import SubtaskList from './SubtaskList'
import CustomTagPicker from '../issues/TagPicker'
import { useRouter } from 'next/router'
import { Divider, Menu, Modal, Skeleton } from 'antd'
import { DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import Uploader from '../issues/Uploader'
import MultiStorypointSelect from './MultiStorypointSelect'
import IssueModal from './IssueModal'
import { Milestone } from '../../taiga-api/milestones'
import { updateUserstoryCache } from '../../updateCache'
import Flex from '../Flex'

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
    const queryCache = useQueryCache()
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
            content: 'Deleting a Userstory is irreversible.',
            onOk: async () => {
                await deleteUserstory(id)
                queryCache.setQueryData(
                    ['milestones', { projectId }],
                    (prevData: Milestone[]) =>
                        prevData?.map((ms) => ({
                            ...ms,
                            user_stories: ms.user_stories.filter(
                                (story) => story.id !== id
                            ),
                        }))
                )
                queryCache.setQueryData(
                    ['backlog', { projectId }],
                    (prevData: UserStory[]) =>
                        prevData?.filter((story) => story.id !== id)
                )
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

    const updateAssignee = async (assigneeId?: number) => {
        const updatedStory = await updateUserstory(id, {
            assigned_to: assigneeId ?? null,
            assigned_users: assigneeId ? [assigneeId] : null,
            version: data.version,
        })
        updateUserstoryCache(updatedStory, id, projectId as string)
    }

    const updateStatus = async (status: number) => {
        const updatedStory = await updateUserstory(id, {
            status,
            version: data.version,
        })
        updateUserstoryCache(updatedStory, id, projectId as string)
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
            innerContent={null}
            outerContent={
                <>
                    <Skeleton loading={isLoading} active>
                        <Uploader
                            type="userstory"
                            action={`${process.env.NEXT_PUBLIC_TAIGA_API_URL}/userstories/attachments`}
                            data={{
                                object_id: data?.id,
                                project: data?.project,
                            }}
                        />
                    </Skeleton>
                    <Divider />

                    <SubtaskList id={id} />
                </>
            }
            actions={menu}
        />
    )
}
