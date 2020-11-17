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
import { useQuery } from 'react-query'
import { getMilestones } from '../../taiga-api/milestones'
import { getTasks } from '../../taiga-api/tasks'
import { getUserstories } from '../../taiga-api/userstories'
import { useRouter } from 'next/router'
import useMedia from 'use-media'

const AchievementContainer = styled(Flex)``

const Achievements = () => {
    const { projectId } = useRouter().query
    const isMobile = useMedia('(max-width: 700px)')

    const { data: sprints = [] } = useQuery(
        ['milestones', { projectId }],
        async (key, { projectId }) => {
            return getMilestones({
                closed: false,
                projectId: projectId as string,
            })
        },
        { enabled: projectId }
    )

    const { data: tasks = [] } = useQuery(
        ['tasks', { projectId }],
        async (key, { projectId }) => {
            const tasks = await getTasks({ projectId })
            return tasks.filter((t) => t.user_story === null)
        },
        { enabled: projectId }
    )

    const { data: stories } = useQuery(
        ['userstories', { projectId }],
        (key, { projectId }) => getUserstories({ projectId }),
        { enabled: projectId }
    )

    const closedSprints =
        sprints?.filter((sprint) => sprint.closed)?.length ?? 0
    const closedBugs =
        stories && tasks
            ? [...stories, ...tasks].filter(
                  (issue) =>
                      issue.is_closed &&
                      issue.tags.find(
                          (tag) => tag.length && tag[0].includes('bug')
                      )
              ).length
            : 0

    const closedIssues =
        stories && tasks
            ? [...stories, ...tasks].filter((issue) => issue.is_closed).length
            : 0

    const storyPoints = stories
        ? [...stories]
              .filter((story) => story.is_closed)
              .reduce(
                  (prev, curr) =>
                      prev +
                      Object.values(curr.points).reduce(
                          (prev, curr) => prev + curr,
                          0
                      ),
                  0
              )
        : 0

    const comments =
        stories?.reduce((prev, curr) => prev + curr.total_comments, 0) ?? 0

    const tags =
        stories && tasks
            ? [...stories, ...tasks].reduce(
                  (prev, curr) => prev + curr.tags.length,
                  0
              )
            : 0

    return (
        <AchievementContainer
            wrap
            direction="row"
            justify={isMobile ? 'center' : 'flex-start'}
            align="center"
        >
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
        </AchievementContainer>
    )
}

export default Achievements
