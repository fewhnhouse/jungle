import React from 'react'
import styled from 'styled-components'
import EditableTitle from '../EditableTitle'
import EditableDescription from '../EditableDescription'
import { queryCache, useQuery } from 'react-query'
import {
    deleteTask,
    getFiltersData,
    getTask,
    updateTask,
} from '../../taiga-api/tasks'
import AssigneeDropdown from '../AssigneeDropdown'
import StatusDropdown from '../StatusDropdown'
import Breadcrumbs from '../TaskBreadcrumbs'
import { useRouter } from 'next/router'
import { Button, Dropdown, Menu, Modal, Select, Skeleton } from 'antd'
import Flex from '../Flex'
import {
    ArrowUpOutlined,
    BookOutlined,
    CloseOutlined,
    DeleteOutlined,
    EllipsisOutlined,
    ExclamationCircleOutlined,
    ProfileOutlined,
    UserOutlined,
} from '@ant-design/icons'
import Comments from './comments/Comments'
import Uploader from '../Uploader'
import UpgradeTask from './UpgradeTask'
import IssueModal from './IssueModal'
import CustomTagPicker from '../TagPicker'

const Label = styled.span`
    margin-top: ${({ theme }) => theme.spacing.mini};
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

const StyledModal = styled(Modal)`
    .ant-modal-close {
        visibility: hidden;
    }
`

const HeaderActionContainer = styled(Flex)`
    & > :first-child {
        margin-right: 5px;
    }
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
    margin-right: 10px;
`

const Sidebar = styled.aside`
    flex: 1;
    padding: ${({ theme }) => theme.spacing.small};
    display: flex;
    flex-direction: column;
    align-items: flex-start;
`

interface Props {
    open: boolean
    onClose: () => void
    id: number
}

interface ActionMenuProps {
    id: number
    milestone: number
}

const { confirm } = Modal

const ActionMenu = ({ id, milestone }: ActionMenuProps) => {
    const { projectId } = useRouter().query

    const handleDelete = () => {
        confirm({
            title: 'Are you sure you want to delete this task?',
            icon: <ExclamationCircleOutlined />,
            content: 'Some descriptions',
            onOk() {
                deleteTask(id).then((res) => {
                    queryCache.invalidateQueries([
                        'tasks',
                        { projectId, milestone },
                    ])
                    queryCache.invalidateQueries(['backlog', { projectId }])
                })
            },
            onCancel() {
                console.log('Cancel')
            },
        })
    }

    const handleConvert = () => {
        //upgrade
    }
    return (
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
            <Menu.Item onClick={handleDelete} key="2" icon={<DeleteOutlined />}>
                Delete Task
            </Menu.Item>
        </Menu>
    )
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
            actions={<ActionMenu id={id} milestone={data?.milestone} />}
        />
    )
}
