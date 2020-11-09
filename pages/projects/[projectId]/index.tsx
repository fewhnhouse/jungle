import styled from 'styled-components'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { PageBody, PageHeader } from '../../../components/Layout'
import PageTitle from '../../../components/PageTitle'
import { queryCache, useQuery } from 'react-query'
import {
    getProject,
    like,
    watch,
    watchers,
    fans,
    unlike,
    unwatch,
} from '../../../taiga-api/projects'
import { getProjectTimeline } from '../../../taiga-api/timelines'
import ActivityListItem from '../../../components/home/ActivityListItem'
import Flex from '../../../components/Flex'
import { Avatar, Badge, Button } from 'antd'
import {
    EyeFilled,
    EyeOutlined,
    LikeFilled,
    LikeOutlined,
} from '@ant-design/icons'

const StyledFlex = styled(Flex)`
    margin-top: 20px;
`

const Container = styled.div`
    &:first-child {
        margin-right: 10px;
    }
    &:last-child {
        margin-left: 10px;
    }
`

const StyledButton = styled(Button)`
    &:first-child {
        margin-left: 0px;
    }
    margin: 0px 2.5px;
    &:last-child {
        margin-right: 0px;
    }
`

const BadgeButtonContainer = styled.div`
    margin: 0px 10px;
`

const StyledAvatar = styled(Avatar)`
    margin: 0px 10px;
    &:first-child {
        margin: 0px;
    }
    box-sizing: border-box;
    transition: 0.2s all ease-in-out;
    cursor: pointer;
    &:hover {
        box-shadow: 0px 0px 2px 1px rgba(0, 0, 0, 0.3);
    }
`

const Project = () => {
    const router = useRouter()
    const { projectId } = router.query

    const { data } = useQuery(
        ['project', { projectId }],
        (key, { projectId }) => getProject(projectId as string),
        {
            enabled: !!projectId,
        }
    )

    const { data: timeline } = useQuery(
        ['projectTimeline', { projectId }],
        (key, { projectId }) => getProjectTimeline(projectId),
        {
            enabled: !!projectId,
        }
    )

    const { data: watchersData } = useQuery(
        ['watchers', { projectId }],
        (key, { projectId }) => watchers(projectId),
        {
            enabled: !!projectId,
        }
    )

    const { data: fansData } = useQuery(
        ['fans', { projectId }],
        (key, { projectId }) => fans(projectId),
        {
            enabled: !!projectId,
        }
    )

    const handleWatch = async () => {
        await (data?.is_watcher
            ? unwatch(projectId.toString())
            : watch(projectId.toString()))
        queryCache.invalidateQueries(['watchers', { projectId }])
        queryCache.invalidateQueries(['project', { projectId }])
    }

    const handleLike = async () => {
        await (data?.is_fan
            ? unlike(projectId.toString())
            : like(projectId.toString()))
        queryCache.invalidateQueries(['fans', { projectId }])
        queryCache.invalidateQueries(['project', { projectId }])
    }

    return (
        <>
            <PageHeader>
                <>
                    <Flex align="center">
                        <PageTitle
                            avatarUrl={data?.logo_big_url ?? 'bmo.png'}
                            title={data?.name}
                            description={data?.description}
                        />
                    </Flex>
                    <StyledFlex>
                        <BadgeButtonContainer>
                            <Badge
                                style={{ backgroundColor: '#1890FF' }}
                                count={watchersData.length ?? 0}
                            >
                                <Button
                                    onClick={handleWatch}
                                    type={data?.is_watcher ? 'primary' : 'default'}
                                    icon={
                                        data?.is_watcher ? (
                                            <EyeFilled />
                                        ) : (
                                            <EyeOutlined />
                                        )
                                    }
                                >
                                    {data?.is_watcher ? 'Watching' : 'Watch'}
                                </Button>
                            </Badge>
                        </BadgeButtonContainer>
                        <BadgeButtonContainer>
                            <Badge
                                style={{ backgroundColor: '#1890FF' }}
                                count={fansData.length ?? 0}
                            >
                                <Button
                                    onClick={handleLike}
                                    type={data?.is_fan ? 'primary' : 'default'}
                                    icon={
                                        data?.is_fan ? (
                                            <LikeFilled />
                                        ) : (
                                            <LikeOutlined />
                                        )
                                    }
                                >
                                    {data?.is_fan ? 'Liked' : 'Like'}
                                </Button>
                            </Badge>
                        </BadgeButtonContainer>
                    </StyledFlex>
                    <StyledFlex justify="space-between">
                        <Flex>
                            {data?.members.map((member) => (
                                <StyledAvatar
                                    size="large"
                                    key={member.id}
                                    src={member.photo}
                                >
                                    {member.full_name
                                        .split(' ')
                                        .reduce(
                                            (prev, curr) =>
                                                prev + curr.charAt(0),
                                            ''
                                        )}
                                </StyledAvatar>
                            ))}
                        </Flex>
                        <Flex>
                            <Link href={`/projects/${projectId}/board`}>
                                <StyledButton>Board</StyledButton>
                            </Link>
                            <Link href={`/projects/${projectId}/board`}>
                                <StyledButton>Backlog</StyledButton>
                            </Link>
                        </Flex>
                    </StyledFlex>
                </>
            </PageHeader>
            <PageBody>
                <Flex>
                    <Container>
                        <h2>Activity</h2>
                        {timeline?.map((item) => (
                            <ActivityListItem
                                key={item.id}
                                activityItem={item}
                            />
                        ))}
                    </Container>
                    <Container>
                        <h2>Recent Tasks</h2>
                    </Container>
                </Flex>
            </PageBody>
        </>
    )
}

export default Project
