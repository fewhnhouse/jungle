import { Skeleton } from 'antd'
import { useRouter } from 'next/router'
import { queryCache, useQuery } from 'react-query'
import { getPoints } from '../../../taiga-api/points'
import { getProject, updateProject } from '../../../taiga-api/projects'
import { getTaskStatuses } from '../../../taiga-api/tasks'
import { getUserstoryStatuses } from '../../../taiga-api/userstories'
import DefaultValueCard from './DefaultValueCard'

const DefaultValues = () => {
    const { projectId } = useRouter().query
    const { data: project, isLoading } = useQuery(
        ['project', { projectId }],
        (_, { projectId }) => getProject(projectId),
        { enabled: projectId }
    )

    const { data: taskStatuses, isLoading: taskStatusesIsLoading } = useQuery(
        ['taskStatuses', { projectId }],
        async (key, { projectId }) => {
            return await getTaskStatuses(projectId as string)
        },
        { enabled: projectId }
    )

    const {
        data: userstoryStatuses,
        isLoading: userstoryStatusesIsLoading,
    } = useQuery(
        ['userstoryStatuses', { projectId }],
        async (key, { projectId }) => {
            return await getUserstoryStatuses(projectId as string)
        },
        { enabled: projectId }
    )

    const { data: storyPoints, isLoading: storyPointsIsLoading } = useQuery(
        ['storyPoints', { projectId }],
        async (key, { projectId }) => {
            return await getPoints(projectId as string)
        },
        { enabled: projectId }
    )

    const handleSubmit = (key: string, dataIndex: string) => (
        values: unknown
    ) => {
        const id = values[dataIndex]
        const updatedProject = updateProject(projectId as string, { [key]: id })
        queryCache.setQueryData(
            ['project', { projectId }],
            () => updatedProject
        )
    }

    return (
        <Skeleton
            loading={
                isLoading ||
                taskStatusesIsLoading ||
                userstoryStatusesIsLoading ||
                storyPointsIsLoading
            }
            active
        >
            <DefaultValueCard
                title="Default Userstory Status"
                description=""
                name="usStatus"
                submitText="Save"
                handleSubmit={handleSubmit('default_us_status', 'usStatus')}
                initialValues={{ usStatus: project.default_us_status }}
                options={taskStatuses?.map((status) => ({
                    value: status.id,
                    label: status.name,
                }))}
            ></DefaultValueCard>
            <DefaultValueCard
                title="Default Task Status"
                description=""
                name="taskStatus"
                submitText="Save"
                handleSubmit={handleSubmit('default_task_status', 'taskStatus')}
                initialValues={{ taskStatus: project.default_task_status }}
                options={userstoryStatuses?.map((status) => ({
                    value: status.id,
                    label: status.name,
                }))}
            ></DefaultValueCard>
            <DefaultValueCard
                title="Default Story Point"
                description=""
                name="points"
                submitText="Save"
                handleSubmit={handleSubmit('default_points', 'points')}
                initialValues={{ points: project.default_points }}
                options={storyPoints?.map((point) => ({
                    value: point.id,
                    label: point.name,
                }))}
            ></DefaultValueCard>
        </Skeleton>
    )
}

export default DefaultValues
