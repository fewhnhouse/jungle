import AchievementBadge from '../Badge/Achievement'
import {
    BugOutlined,
    CommentOutlined,
    DashboardOutlined,
    FireOutlined,
    NumberOutlined,
    RobotOutlined,
    TagsOutlined,
} from '@ant-design/icons'
import styled from 'styled-components'
import Flex from '../Flex'
import useMedia from 'use-media'
import { Skeleton } from 'antd'
import { useContext } from 'react'
import { AchievementContext } from '../project/NotificationProvider'

const AchievementContainer = styled(Flex)``

const Achievements = () => {
    const isMobile = useMedia('(max-width: 700px)')
    const {
        comments,
        closedSprints,
        closedBugs,
        closedIssues,
        storyPoints,
        tags,
        loading,
    } = useContext(AchievementContext)

    return (
        <AchievementContainer
            wrap
            direction="row"
            justify={isMobile ? 'center' : 'flex-start'}
            align="center"
        >
            <Skeleton active loading={loading}>
                <AchievementBadge
                    score={comments}
                    levelRange={[
                        [0, 1],
                        [1, 10],
                        [10, 50],
                        [50, 500],
                    ]}
                    icon={<CommentOutlined />}
                    title="Author"
                    label="Comments"
                    description="Comment on issues to advance this achievement."
                />
                <AchievementBadge
                    score={closedSprints}
                    icon={<DashboardOutlined />}
                    levelRange={[
                        [0, 1],
                        [1, 5],
                        [5, 20],
                        [20, 50],
                    ]}
                    title="Sprinter"
                    label="Sprints"
                    description="Close sprints to advance this achievement."
                />
                <AchievementBadge
                    score={tags}
                    icon={<TagsOutlined />}
                    levelRange={[
                        [0, 1],
                        [1, 10],
                        [10, 50],
                        [50, 200],
                    ]}
                    title="Sale!"
                    label="Tags"
                    description="Tag your issues to advance this achievement."
                />
                <AchievementBadge
                    score={closedBugs}
                    icon={<BugOutlined />}
                    levelRange={[
                        [0, 1],
                        [1, 10],
                        [10, 50],
                        [50, 200],
                    ]}
                    title="Bug Basher"
                    label="Bugs"
                    description="Close bugs to advance this achievement."
                />
                <AchievementBadge
                    score={storyPoints}
                    icon={<FireOutlined />}
                    levelRange={[
                        [0, 10],
                        [10, 50],
                        [50, 200],
                        [200, 1000],
                    ]}
                    title="Burn it down!"
                    label="Story Points"
                    description="Burn down a certain amount of story points to advance this achievement."
                />
                <AchievementBadge
                    score={4}
                    levelRange={[
                        [0, 10],
                        [10, 50],
                        [50, 200],
                        [200, 1000],
                    ]}
                    icon={<NumberOutlined />}
                    title="Even the Odds"
                    label="Dunno"
                    description="Dont know yet"
                />
                <AchievementBadge
                    score={closedIssues}
                    levelRange={[
                        [0, 10],
                        [10, 50],
                        [50, 200],
                        [200, 500],
                    ]}
                    icon={<RobotOutlined />}
                    title="Ticket Machine"
                    label="Issues"
                    description="Close a certain amount of issues to advance this achievement."
                />
            </Skeleton>
        </AchievementContainer>
    )
}

export default Achievements
