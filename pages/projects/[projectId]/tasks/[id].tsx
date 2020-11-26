import {
    BookOutlined,
    DeleteOutlined,
    ExclamationCircleOutlined,
    UserOutlined,
} from '@ant-design/icons'
import { Button, Dropdown, Menu, Modal, Skeleton } from 'antd'
import { useRouter } from 'next/router'
import { queryCache, useQuery } from 'react-query'
import styled from 'styled-components'
import useMedia from 'use-media'
import Flex from '../../../../components/Flex'
import AssigneeDropdown from '../../../../components/issues/AssigneeDropdown'
import IssuePage from '../../../../components/issues/IssuePage'
import StatusDropdown from '../../../../components/issues/StatusDropdown'
import CustomTagPicker from '../../../../components/issues/TagPicker'
import Uploader from '../../../../components/issues/Uploader'
import { PageBody, PageHeader } from '../../../../components/Layout'
import PageTitle from '../../../../components/PageTitle'
import { getProject } from '../../../../taiga-api/projects'
import {
    deleteTask,
    getFiltersData,
    getTask,
    promoteToUserstory,
    Task,
    updateTask,
} from '../../../../taiga-api/tasks'

const { confirm } = Modal

const BtnContainer = styled(Flex)``

const StyledBtn = styled(Button)`
    margin: 0px 5px;
    width: 100%;
    &:first-child {
        margin-left: 0px;
    }
    &:last-child {
        margin-right: 0px;
    }
    @media (max-width: 700px) {
        margin: 5px 0px;
        &:first-child {
            margin-top: 0px;
        }
        &:last-child {
            margin-bottom: 0px;
        }
    }
`

const Label = styled.span`
    margin-top: ${({ theme }) => theme.spacing.mini};
`

const TaskPage = () => {
    const { id, projectId } = useRouter().query

    const { isLoading, data, isError } = useQuery<Task>(
        ['task', { id }],
        (key, { id }) => getTask(id),
        { enabled: id }
    )
    const { data: project } = useQuery(
        ['project', { projectId }],
        (key, { projectId }) => getProject(projectId as string),
        { enabled: projectId }
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
                await deleteTask(parseInt(id as string, 10))
                queryCache.invalidateQueries([
                    'tasks',
                    { projectId, milestone: data?.id },
                ])
                queryCache.invalidateQueries(['tasks', { projectId }])
                queryCache.invalidateQueries(['backlog', { projectId }])
                queryCache.invalidateQueries(['milestones', { projectId }])
            },
            onCancel() {
                console.log('Cancel')
            },
        })
    }

    const handleConvert = async () => {
        await promoteToUserstory(
            parseInt(id as string, 10),
            projectId as string
        )
        queryCache.invalidateQueries(['tasks', { projectId }])
        queryCache.invalidateQueries(['backlog', { projectId }])
        queryCache.invalidateQueries(['milestones', { projectId }])
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

    const updateAssignee = async (assigneeId: number) => {
        const updatedTask = await updateTask(parseInt(id as string, 10), {
            assigned_to: assigneeId,
            assigned_users: [assigneeId],
            version: data.version,
        })
        queryCache.setQueryData(['task', { id }], () => updatedTask)
    }

    const updateStatus = async (status: number) => {
        const updatedTask = await updateTask(parseInt(id as string, 10), {
            status,
            version: data.version,
        })
        queryCache.setQueryData(['task', { id }], () => updatedTask)
    }

    const isMobile = useMedia('(max-width: 700px)')

    return (
        <div>
            <PageHeader>
                <PageTitle
                    breadcrumbs={[
                        { href: `/projects`, label: 'Projects' },
                        {
                            href: `/projects/${projectId}`,
                            label: project?.name,
                        },
                        {
                            href: `/projects/${projectId}/tasks/${id}`,
                            label: `Task ${data?.id}`,
                        },
                    ]}
                    title={data?.subject}
                    description={data?.description}
                />
            </PageHeader>
            <PageBody>
                <Skeleton active paragraph={{ rows: 5 }} loading={isLoading}>
                    <IssuePage
                        type="task"
                        innerContent={null}
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
                                <CustomTagPicker
                                    type="task"
                                    id={parseInt(id as string, 10)}
                                />
                                <Label>Actions</Label>
                                <BtnContainer
                                    direction={isMobile ? 'column' : 'row'}
                                >
                                    <StyledBtn icon={<BookOutlined />}>
                                        Convert to Userstory
                                    </StyledBtn>
                                    <StyledBtn icon={<UserOutlined />}>
                                        Change Parent
                                    </StyledBtn>
                                    <StyledBtn danger icon={<DeleteOutlined />}>
                                        Delete Task
                                    </StyledBtn>
                                </BtnContainer>
                            </Skeleton>
                        }
                        outerContent={
                            <Skeleton loading={isLoading} active>
                                <Uploader
                                    action={`${process.env.NEXT_PUBLIC_TAIGA_API_URL}/tasks/attachments`}
                                    type="task"
                                    data={{
                                        object_id: data?.id,
                                        project: data?.project,
                                    }}
                                />
                            </Skeleton>
                        }
                        data={data}
                    />
                </Skeleton>
            </PageBody>
        </div>
    )
}

export default TaskPage
