import { useQuery, useQueryCache } from 'react-query'
import {
    fans,
    like,
    Project,
    SingleProjectInterface,
    unlike,
    unwatch,
    watch,
    Watcher,
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
import { useRouter } from 'next/router'
import { getMe } from '../../taiga-api/users'
import useMedia from 'use-media'

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
        @media (max-width: 480px) {
            width: unset;
            padding: 0px 10px;
        }
    }
`

const Actions = ({ project }: { project: Project }) => {
    const { projectId } = useRouter().query
    const { data: me } = useQuery('me', () => getMe())
    const queryCache = useQueryCache()
    const { data: watchersData } = useQuery(
        ['watchers', { projectId }],
        (key, { projectId }) => watchers(projectId),
        {
            enabled: !!projectId,
        }
    )
    const isMobile = useMedia('screen and (max-width: 480px)')

    const { data: fansData } = useQuery(
        ['fans', { projectId: projectId }],
        (key, { projectId }) => fans(projectId),
        {
            enabled: !!projectId,
        }
    )

    const handleWatch = async () => {
        const isWatcher = project?.is_watcher
        queryCache.setQueryData(
            ['watchers', { projectId }],
            (prevData: Watcher[]) => {
                console.log(prevData, isWatcher)
                if (isWatcher) {
                    return (
                        prevData?.filter((watcher) => watcher.id !== me?.id) ??
                        []
                    )
                } else {
                    const newWatcher = {
                        id: me?.id,
                        username: me?.username,
                        full_name: me?.full_name,
                    }
                    return prevData ? [...prevData, newWatcher] : [newWatcher]
                }
            }
        )
        queryCache.setQueryData(
            ['project', { projectId }],
            (prevProject: SingleProjectInterface) => ({
                ...prevProject,
                is_watcher: !project?.is_watcher,
            })
        )
        await (isWatcher
            ? unwatch(projectId.toString())
            : watch(projectId.toString()))
    }

    const handleLike = async () => {
        const isFan = project?.is_fan
        queryCache.setQueryData(
            ['fans', { projectId }],
            (prevData: Watcher[]) => {
                if (isFan) {
                    return prevData?.filter((fan) => fan.id !== me?.id) ?? []
                } else {
                    const newFan = {
                        id: me?.id,
                        username: me?.username,
                        full_name: me?.full_name,
                    }
                    return prevData ? [...prevData, newFan] : [newFan]
                }
            }
        )
        queryCache.setQueryData(
            ['project', { projectId }],
            (prevProject: SingleProjectInterface) => ({
                ...prevProject,
                is_fan: !project?.is_fan,
            })
        )
        await (isFan
            ? unlike(projectId.toString())
            : like(projectId.toString()))
    }
    return (
        <>
            <ActionContainer>
                <Link href={`/projects/${projectId}/settings`}>
                    <Button icon={<SettingOutlined />}>
                        {isMobile ? null : 'Settings'}
                    </Button>
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
                        {isMobile
                            ? null
                            : project?.is_watcher
                            ? 'Watching'
                            : 'Watch'}
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
                        {isMobile ? null : project?.is_fan ? 'Liked' : 'Like'}
                    </Button>
                </Badge>
            </ActionContainer>
        </>
    )
}

export default Actions
