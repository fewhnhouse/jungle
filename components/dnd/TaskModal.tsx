import React from 'react'
import styled from 'styled-components'
import EditableTitle from '../EditableTitle'
import EditableDescription from '../EditableDescription'
import EditableNumber from '../EditableNumber'
import { queryCache, useQuery } from 'react-query'
import { getFiltersData, getTask, updateTask } from '../../taiga-api/tasks'
import AssigneeDropdown from '../AssigneeDropdown'
import StatusDropdown from '../StatusDropdown'
import Breadcrumbs from '../TaskBreadcrumbs'
import { useRouter } from 'next/router'
import { Modal, Select, Skeleton, Upload } from 'antd'
import Flex from '../Flex'
import { ProfileOutlined, UploadOutlined } from '@ant-design/icons'
import Comments from './comments/Comments'
import Uploader from '../Uploader'

const Label = styled.span`
    margin-top: ${({ theme }) => theme.spacing.mini};
`

const StyledFlex = styled(Flex)`
    margin: 0px 10px;
    span {
        &:first-child {
            margin-right: 5px;
        }
    }
`

const StyledTaskIcon = styled(ProfileOutlined)`
    background: #45aaff;
    border-radius: 3px;
    font-size: 20px;
    padding: 5px;
    color: #2c3e50;
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
        ['task', { id }],
        (key, { id }) => getTask(id),
        { enabled: open }
    )

    const { data: taskFilters } = useQuery(
        ['taskFilters', { projectId }],
        (key, { projectId }) => getFiltersData(projectId as string),
        { enabled: projectId }
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

    const token = localStorage.getItem('auth-token')

    return (
        <Modal footer={null} visible={open} onCancel={onClose} onOk={onClose}>
            {isLoading ? (
                <Skeleton active paragraph={{ rows: 5 }} />
            ) : (
                <Flex direction="column">
                    <Breadcrumbs data={data} />
                    <Main>
                        <Content>
                            <Flex align="center">
                                <StyledTaskIcon />
                                <EditableTitle
                                    onSubmit={() => console.log('submit')}
                                    initialValue={data?.subject}
                                />
                            </Flex>
                            <EditableDescription
                                initialValue={data?.description}
                            />
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
                            <Label>Priority</Label>
                            <Select style={{ width: '100%' }} />
                            <Label>Story Points</Label>
                            <EditableNumber initialValue={1} />
                        </Sidebar>
                    </Main>
                    <Uploader
                        data={{
                            object_id: data?.id,
                            project: data?.project,
                        }}
                    />
                    <Comments type="task" id={id} version={data?.version} />
                </Flex>
            )}
        </Modal>
    )
}
