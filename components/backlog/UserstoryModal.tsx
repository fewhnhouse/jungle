import React from 'react'
import styled from 'styled-components'
import EditableTitle from '../EditableTitle'
import EditableDescription from '../EditableDescription'
import EditableNumber from '../EditableNumber'
import { queryCache, useQuery } from 'react-query'
import AssigneeDropdown from '../AssigneeDropdown'
import StatusDropdown from '../StatusDropdown'
import {
    getFiltersData,
    getUserstory,
    updateUserstory,
    UserStory,
} from '../../taiga-api/userstories'
import Breadcrumbs from './Breadcrumbs'
import SubtaskList from './SubtaskList'
import CustomTagPicker from '../TagPicker'
import { useRouter } from 'next/router'
import { Divider, Modal, Skeleton, Upload } from 'antd'
import Flex from '../Flex'
import { UploadOutlined } from '@ant-design/icons'

const StyledFlex = styled(Flex)`
    margin: 0px 10px;
    span {
        &:first-child {
            margin-right: 5px;
        }
    }
`
const Label = styled.span`
    margin-top: ${({ theme }) => theme.spacing.mini};
`

const Main = styled.div`
    display: flex;
    width: 100%;
    flex-direction: row;
    @media only screen and (max-width: 600px) {
        flex-direction: column;
    }
    overflow: auto;
    height: 100%;
`

const Content = styled.div`
    flex: 3;
    display: flex;
    flex-direction: column;
    padding: 10px;
`

const Sidebar = styled.aside`
    flex: 1;
    padding: ${({ theme }) => theme.spacing.small};
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    min-width: 180px;
`

interface Props {
    open: boolean
    onClose: () => void
    id: number
}

export default function IssueModal({ id, open, onClose }: Props) {
    const { projectId } = useRouter().query
    const { isLoading, data, isError } = useQuery(
        ['story', { id }],
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

    const token = localStorage.getItem('auth-token')

    const updateAssignee = async (assigneeId: number) => {
        const updatedStory = await updateUserstory(id, {
            assigned_to: assigneeId,
            assigned_users: [assigneeId],
            version: data.version,
        })
        queryCache.setQueryData(['story', { id }], () => updatedStory)
    }

    const updateStatus = async (status: number) => {
        const updatedStory = await updateUserstory(id, {
            status,
            version: data.version,
        })
        queryCache.setQueryData(['story', { id }], () => updatedStory)
    }

    const handleTitleSubmit = async (subject: string) => {
        queryCache.setQueryData(['story', { id }], (prevData: UserStory) => ({
            ...prevData,
            subject,
        }))

        await updateUserstory(id, {
            subject,
            version: data.version,
        })
        queryCache.invalidateQueries('backlog')
        queryCache.invalidateQueries('milestones')
    }

    return data ? (
        <Modal footer={null} visible={open} onCancel={onClose} onOk={onClose}>
            {isLoading ? (
                <Skeleton active paragraph={{ rows: 5 }} />
            ) : (
                <Flex direction="column">
                    <Breadcrumbs data={data} />
                    <Main>
                        <Content>
                            <EditableTitle
                                onSubmit={handleTitleSubmit}
                                initialValue={data?.subject}
                            />
                            <EditableDescription
                                initialValue={data?.description}
                            />
                            <Upload.Dragger
                                data={{
                                    object_id: data.id,
                                    project: data.project,
                                }}
                                name="attached_file"
                                headers={{
                                    Authorization: token && `Bearer ${token}`,
                                }}
                                action={`${process.env.NEXT_PUBLIC_TAIGA_API_URL}/tasks/attachments`}
                            >
                                <StyledFlex align="center">
                                    <UploadOutlined size={32} />
                                    <p>Click or Drag files to upload</p>
                                </StyledFlex>
                            </Upload.Dragger>
                            <Divider />
                            <SubtaskList id={id} />
                        </Content>
                        <Sidebar>
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
                            <CustomTagPicker id={id} />
                            <Label>Story Points</Label>
                            <EditableNumber initialValue={1} />
                        </Sidebar>
                    </Main>
                </Flex>
            )}
        </Modal>
    ) : null
}
