import {
    BellOutlined,
    CommentOutlined,
    EyeOutlined,
    InfoOutlined,
    NotificationOutlined,
    ProjectOutlined,
    UserAddOutlined,
} from '@ant-design/icons'
import {
    Avatar,
    Badge,
    Button,
    Divider,
    Dropdown,
    Empty,
    List,
    Skeleton,
    Tooltip,
    Typography,
} from 'antd'
import Link from 'next/link'
import { useEffect } from 'react'
import { useQueryCache, useQuery } from 'react-query'
import styled from 'styled-components'
import {
    getNotifications,
    markAsRead,
    Notification,
    NotifiedProject,
} from '../../taiga-api/notifications'
import useNotifications from '../../util/useNotifications'
import usePrev from '../../util/usePrev'
import Flex from '../Flex'

const Container = styled.div`
    margin: 0px 10px;
`

const MenuContainer = styled(Flex)`
    position: relative;
    width: 500px;
    height: 300px;
    background: white;
    border-radius: 2px;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.25);
    padding: 20px;
    overflow: auto;
`

const StyledAnchor = styled.a`
    color: rgba(0, 0, 0, 0.45);
    &:hover {
        color: rgba(0, 0, 0, 0.75);
    }
`

const NotificationButton = styled(Button)`
    margin-right: 5px;
`

const getIcon = (notification: Notification) => {
    //1: assign member to task / userstory
    //2:
    //3: add as watcher to task / userstory
    //4: add (as member) to project
    //5:
    //6: mentioned in comment of task / userstory
    switch (notification.event_type) {
        case 1:
            return <UserAddOutlined />
        case 3:
            return <EyeOutlined />
        case 4:
            return <ProjectOutlined />
        case 6:
            return <CommentOutlined />
        default:
            return <InfoOutlined />
    }
}

const getNotificationTitle = (notification: Notification) => {
    switch (notification.event_type) {
        case 1:
            return `You were assigned to ${notification.data.obj?.content_type} ${notification.data.obj?.id} by ${notification.data.user.name}`
        case 3:
            return `You were added as Watcher of ${notification.data.obj?.content_type} ${notification.data.obj?.id} by ${notification.data.user.name}`
        case 4:
            return `You were added as member of Project ${notification.data.project.name} by ${notification.data.user.name}`
        case 6:
            return `You were mentioned in comment of ${notification.data.obj?.content_type} ${notification.data.obj?.id} by ${notification.data.user.name}`
        default:
            return 'Unknown Notification'
    }
}

const getTitle = (notification: Notification) => {
    switch (notification.event_type) {
        case 1:
            return (
                <span>
                    Assigned to{' '}
                    <Link
                        href={`/projects/${notification.data.project.id}/${
                            notification.data.obj?.content_type === 'task'
                                ? 'tasks'
                                : 'userstories'
                        }/${notification.data.obj?.id}`}
                    >
                        <a>{notification.data.obj?.subject}</a>
                    </Link>
                </span>
            )
        case 3:
            return (
                <span>
                    Added as Watcher of{' '}
                    <Link
                        href={`/projects/${notification.data.project.id}/${
                            notification.data.obj?.content_type === 'task'
                                ? 'tasks'
                                : 'userstories'
                        }/${notification.data.obj?.id}`}
                    >
                        <a>{notification.data.obj?.subject}</a>
                    </Link>
                </span>
            )
        case 4:
            return (
                <span>
                    Added as member of Project{' '}
                    <Link
                        href={`/projects/${1}/tasks/${
                            notification.data.project.id
                        }`}
                    >
                        <a>{notification.data.project.name} </a>
                    </Link>
                </span>
            )
        case 6:
            return (
                <span>
                    Mentioned in comment of{' '}
                    <Link
                        href={`/projects/${notification.data.project.id}/tasks/${notification.data.obj?.id}`}
                    >
                        <a>
                            {notification.data.obj?.content_type}{' '}
                            {notification.data.obj?.id}
                        </a>
                    </Link>
                </span>
            )
        default:
            return 'Unknown Notification'
    }
}

const getDescription = (notification: Notification) => {
    return (
        <div>
            In:{' '}
            <Link passHref href={`/projects/${notification.data.project.id}`}>
                <StyledAnchor>{notification.data.project.name}</StyledAnchor>
            </Link>{' '}
            <Divider type="vertical" />
            By:{' '}
            <Link passHref href={`/users/${notification.data.user.id}`}>
                <StyledAnchor>{notification.data.user.name}</StyledAnchor>
            </Link>{' '}
        </div>
    )
}

export default function Notifications() {
    const { permission, requestPermission } = useNotifications()
    const { data, isLoading } = useQuery(
        'notifications',
        () => getNotifications(true, 1),
        { refetchInterval: 5000 }
    )
    const queryCache = useQueryCache()

    const prevData = usePrev(data)

    useEffect(() => {
        if (prevData && prevData.objects && data && data.objects) {
            const newNotifications = data.objects.filter(
                (notification) =>
                    !prevData.objects.find(
                        (prevNotification) =>
                            prevNotification.id === notification.id
                    )
            )
            if (newNotifications.length) {
                newNotifications.forEach((notification) => {
                    new window.Notification('New Notification', {
                        body: getNotificationTitle(notification),
                    })
                })
            }
        }
    }, [prevData, data])

    const projects: NotifiedProject[] = data?.objects?.reduce(
        (prev, curr) =>
            prev.find((project) => curr.data.project.id === project.id)
                ? prev
                : [...prev, curr.data.project],
        []
    )

    const handleMarkAsRead = async () => {
        await markAsRead()
        queryCache.setQueryData('notifications', { objects: [], total: 0 })
    }

    const menu = (
        <MenuContainer direction="column" justify="center" align="center">
            <Skeleton loading={isLoading} active>
                {data?.total === 0 ? (
                    <Empty description="You do not have any Notifications." />
                ) : (
                    <Flex
                        fluid
                        justify="flex-start"
                        align="flex-start"
                        direction="column"
                    >
                        <Flex justify="space-between" style={{ width: '100%' }}>
                            <Typography.Title level={3}>
                                Notifications
                            </Typography.Title>
                            <Flex align="center">
                                {permission === 'default' && (
                                    <Tooltip title="Enable Desktop Notifications">
                                        <NotificationButton
                                            onClick={requestPermission}
                                            icon={<BellOutlined />}
                                        ></NotificationButton>
                                    </Tooltip>
                                )}

                                <Button onClick={handleMarkAsRead}>
                                    Dismiss
                                </Button>
                            </Flex>
                        </Flex>
                        <Typography.Text>
                            {`You have ${data?.total} Notifications across ${
                                projects?.length
                            } Project${projects?.length > 1 ? 's' : ''}.`}
                        </Typography.Text>
                        <List
                            dataSource={data?.objects ?? []}
                            renderItem={(notification: Notification) => (
                                <List.Item key={notification.id}>
                                    <List.Item.Meta
                                        avatar={
                                            <Avatar
                                                shape="square"
                                                icon={getIcon(notification)}
                                            />
                                        }
                                        title={getTitle(notification)}
                                        description={getDescription(
                                            notification
                                        )}
                                    />
                                </List.Item>
                            )}
                            style={{ width: '100%' }}
                        />
                    </Flex>
                )}
            </Skeleton>
        </MenuContainer>
    )
    return (
        <Container>
            <Badge count={data?.total}>
                <Dropdown trigger={['click']} overlay={menu}>
                    <Button icon={<NotificationOutlined />}></Button>
                </Dropdown>
            </Badge>
        </Container>
    )
}
