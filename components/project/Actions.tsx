import { queryCache, useQuery } from 'react-query'
import {
    fans,
    like,
    Project,
    unlike,
    unwatch,
    watch,
    watchers,
} from '../../taiga-api/projects'
import {
    EyeFilled,
    EyeOutlined,
    LikeFilled,
    LikeOutlined,
    SettingOutlined,
} from '@ant-design/icons'
import styled from 'styled-components'
import { Badge, Button } from 'antd'
import Link from 'next/link'

export const ActionContainer = styled.div`
    margin: 6px 0px;
    &:first-child {
        margin-top: 0px;
    }
    &:last-child {
        margin-bottom: 0px;
    }
    @media (max-width: 700px) {
        margin: 0px 10px;
        &:first-child {
            margin-left: 0px;
        }
        &:last-child {
            margin-right: 0px;
        }
    }
    button {
        width: 110px;
    }
`

const Actions = ({ project }: { project: Project }) => {
    const { data: watchersData } = useQuery(
        ['watchers', { projectId: project.id }],
        (key, { projectId }) => watchers(projectId),
        {
            enabled: !!project.id,
        }
    )

    const { data: fansData } = useQuery(
        ['fans', { projectId: project.id }],
        (key, { projectId }) => fans(projectId),
        {
            enabled: !!project.id,
        }
    )

    const handleWatch = async () => {
        await (project?.is_watcher
            ? unwatch(project.id.toString())
            : watch(project.id.toString()))
        queryCache.invalidateQueries(['watchers', { projectId: project.id }])
        queryCache.invalidateQueries(['project', { projectId: project.id }])
    }

    const handleLike = async () => {
        await (project?.is_fan
            ? unlike(project.id.toString())
            : like(project.id.toString()))
        queryCache.invalidateQueries(['fans', { projectId: project.id }])
        queryCache.invalidateQueries(['project', { projectId: project.id }])
    }
    return (
        <>
            <ActionContainer>
                <Link href={`/projects/${project.id}/settings`}>
                    <Button icon={<SettingOutlined />}>Settings</Button>
                </Link>
            </ActionContainer>

            <ActionContainer>
                <Badge
                    style={{ backgroundColor: '#1890FF' }}
                    count={watchersData?.length ?? 0}
                >
                    <Button
                        onClick={handleWatch}
                        type={project?.is_watcher ? 'primary' : 'default'}
                        icon={
                            project?.is_watcher ? (
                                <EyeFilled />
                            ) : (
                                <EyeOutlined />
                            )
                        }
                    >
                        {project?.is_watcher ? 'Watching' : 'Watch'}
                    </Button>
                </Badge>
            </ActionContainer>
            <ActionContainer>
                <Badge
                    style={{ backgroundColor: '#1890FF' }}
                    count={fansData?.length ?? 0}
                >
                    <Button
                        onClick={handleLike}
                        type={project?.is_fan ? 'primary' : 'default'}
                        icon={
                            project?.is_fan ? <LikeFilled /> : <LikeOutlined />
                        }
                    >
                        {project?.is_fan ? 'Liked' : 'Like'}
                    </Button>
                </Badge>
            </ActionContainer>
        </>
    )
}

export default Actions
