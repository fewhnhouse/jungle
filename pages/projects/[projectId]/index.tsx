import styled from 'styled-components'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { PageBody, PageHeader } from '../../../components/Layout'
import PageTitle from '../../../components/PageTitle'
import { useQuery } from 'react-query'
import { getProject } from '../../../taiga-api/projects'
import { getProjectTimeline } from '../../../taiga-api/timelines'
import ActivityListItem from '../../../components/home/ActivityListItem'
import Flex from '../../../components/Flex'
import { Avatar, Button } from 'antd'
import LevelDisplay from '../../../components/LevelDisplay/LevelDisplay'
import Actions from '../../../components/project/Actions'
import AchievementBadge from '../../../components/Badge/Badge'
import {
    BugOutlined,
    CommentOutlined,
    DashboardOutlined,
    FireOutlined,
    NumberOutlined,
    RobotOutlined,
    TagsOutlined,
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

    return (
        <>
            <PageHeader>
                <>
                    <Flex direction="column" align="flex-start">
                        <PageTitle
                            avatarUrl={data?.logo_big_url ?? '/bmo.png'}
                            title={data?.name}
                            description={data?.description}
                            actions={data && <Actions project={data} />}
                        />
                        <LevelDisplay />
                    </Flex>
                    <StyledFlex>
                        <AchievementBadge
                            level={2}
                            icon={<CommentOutlined />}
                            title="Author"
                        />
                        <AchievementBadge
                            level={1}
                            icon={<DashboardOutlined />}
                            title="Sprinter"
                        />
                        <AchievementBadge
                            level={3}
                            icon={<TagsOutlined />}
                            title="Sale!"
                        />
                        <AchievementBadge
                            level={3}
                            icon={<BugOutlined />}
                            title="Bug Basher"
                        />
                        <AchievementBadge
                            level={2}
                            icon={<FireOutlined />}
                            title="Burn it down!"
                        />
                        <AchievementBadge
                            level={4}
                            icon={<NumberOutlined />}
                            title="Estimation? This is guaranteed."
                        />
                        <AchievementBadge
                            level={2}
                            icon={<RobotOutlined />}
                            title="Ticket Machine"
                        />
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
