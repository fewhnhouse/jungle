import { Skeleton } from 'antd'
import { useRouter } from 'next/router'
import { useQuery } from 'react-query'
import { getPoints } from '../../../taiga-api/points'
import { getProject } from '../../../taiga-api/projects'
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
                name="name"
                submitText="Save"
                handleSubmit={() => console.log('submit')}
                initialValues={{ name: '' }}
                options={taskStatuses?.map((status) => ({
                    value: status.id,
                    label: status.name,
                }))}
            ></DefaultValueCard>
            <DefaultValueCard
                title="Default Task Status"
                description=""
                name="name"
                submitText="Save"
                handleSubmit={() => console.log('submit')}
                initialValues={{ name: '' }}
                options={userstoryStatuses?.map((status) => ({
                    value: status.id,
                    label: status.name,
                }))}
            ></DefaultValueCard>
            <DefaultValueCard
                title="Default Story Point"
                description=""
                name="name"
                submitText="Save"
                handleSubmit={() => console.log('submit')}
                initialValues={{ name: '' }}
                options={storyPoints?.map((point) => ({
                    value: point.id,
                    label: point.name,
                }))}
            ></DefaultValueCard>
        </Skeleton>
    )
}

export default DefaultValues
