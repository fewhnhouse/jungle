import { DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import { Button, Modal, Skeleton } from 'antd'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useQueryCache, useQuery } from 'react-query'
import styled from 'styled-components'
import useMedia from 'use-media'
import MultiStoryPointCascader from '../../../../components/dnd/MultiStorypointSelect'
import SubtaskList from '../../../../components/dnd/SubtaskList'
import Flex from '../../../../components/Flex'
import SingleAssigneeDropdown from '../../../../components/issues/SingleAssigneeDropdown'
import IssuePage from '../../../../components/issues/IssuePage'
import StatusDropdown from '../../../../components/issues/StatusDropdown'
import CustomTagPicker from '../../../../components/issues/TagPicker'
import Uploader from '../../../../components/issues/Uploader'
import { PageBody, PageHeader } from '../../../../components/Layout'
import PageTitle from '../../../../components/PageTitle'
import { getProject } from '../../../../taiga-api/projects'
import { getFiltersData } from '../../../../taiga-api/tasks'
import {
    deleteUserstory,
    getUserstory,
    updateUserstory,
    UserStory,
} from '../../../../taiga-api/userstories'

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

const UserstoryPage = () => {
    const { id, projectId } = useRouter().query
    const queryCache = useQueryCache()

    const { isLoading, data, isError } = useQuery(
        ['userstory', { id }],
        (key, { id }) => getUserstory(id),
        { enabled: !!id }
    )
    const { data: project } = useQuery(
        ['project', { projectId }],
        (key, { projectId }) => getProject(projectId as string),
        { enabled: !!projectId }
    )
    const { data: storyFilters } = useQuery(
        ['storyFilters', { projectId }],
        (key, { projectId }) => getFiltersData(projectId as string),
        { enabled: !!projectId }
    )

    const handleDelete = () => {
        confirm({
            title: 'Are you sure you want to delete this story?',
            icon: <ExclamationCircleOutlined />,
            centered: true,
            content: 'Some descriptions',
            onOk: async () => {
                await deleteUserstory(parseInt(id as string, 10))
                queryCache.setQueryData(
                    ['userstories', { projectId }],
                    (prevData: UserStory[]) =>
                        prevData?.filter((story) => story.id.toString() !== id)
                )
            },
        })
    }

    const statusData =
        storyFilters?.statuses.map((status) => ({
            value: status.id,
            label: status.name,
        })) ?? []

    const updateAssignee = async (assigneeId: number) => {
        const updatedStory = await updateUserstory(parseInt(id as string, 10), {
            assigned_to: assigneeId,
            assigned_users: [assigneeId],
            version: data.version,
        })
        queryCache.setQueryData(['userstory', { id }], () => updatedStory)
    }

    const updateStatus = async (status: number) => {
        const updatedStory = await updateUserstory(parseInt(id as string, 10), {
            status,
            version: data.version,
        })
        queryCache.setQueryData(['userstory', { id }], () => updatedStory)
    }

    const isMobile = useMedia('(max-width: 700px)')

    return (
        <div>
            <Head>
                <title>{data?.subject}</title>
                <meta
                    name="viewport"
                    content="initial-scale=1.0, width=device-width"
                />
            </Head>

            <PageHeader>
                <PageTitle
                    breadcrumbs={[
                        { href: `/projects`, label: 'Projects' },
                        {
                            href: `/projects/${projectId}`,
                            label: project?.name,
                        },
                        {
                            href: `/projects/${projectId}/userstories/${id}`,
                            label: `Userstory ${data?.id}`,
                        },
                    ]}
                    title={data?.subject}
                />
            </PageHeader>
            <PageBody>
                <Skeleton active paragraph={{ rows: 5 }} loading={isLoading}>
                    <IssuePage
                        type="userstory"
                        sidebar={
                            <Skeleton loading={isLoading} active>
                                {data && (
                                    <>
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
                                        <CustomTagPicker
                                            type="userstory"
                                            id={parseInt(id as string, 10)}
                                        />
                                        <Label>Story Points</Label>
                                        <MultiStoryPointCascader data={data} />
                                        <Label>Actions</Label>
                                        <BtnContainer
                                            direction={
                                                isMobile ? 'column' : 'row'
                                            }
                                        >
                                            <StyledBtn
                                                danger
                                                onClick={handleDelete}
                                                icon={<DeleteOutlined />}
                                            >
                                                Delete Userstory
                                            </StyledBtn>
                                        </BtnContainer>
                                    </>
                                )}
                            </Skeleton>
                        }
                        outerContent={
                            <SubtaskList id={parseInt(id as string, 10)} />
                        }
                        innerContent={
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
                        }
                        data={data}
                    />
                </Skeleton>
            </PageBody>
        </div>
    )
}

export default UserstoryPage
