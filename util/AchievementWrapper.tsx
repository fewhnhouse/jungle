import {
    BugOutlined,
    CommentOutlined,
    DashboardOutlined,
    FireOutlined,
    NumberOutlined,
    RobotOutlined,
    TagsOutlined,
} from '@ant-design/icons'
import { notification } from 'antd'
import { useRouter } from 'next/router'
import { createContext, useEffect } from 'react'
import { useQuery } from 'react-query'
import { getMilestones } from '../taiga-api/milestones'
import { getTasks } from '../taiga-api/tasks'
import { getUserstories } from '../taiga-api/userstories'
import usePrev from './usePrev'

export const AchievementContext = createContext({
    achievements: [],
    isLoading: false,
    totalLevelRange: [],
    totalScore: 0,
})

export interface Achievement {
    score: number
    levelRange: [number, number][]
    icon: React.ReactNode
    title: React.ReactNode
    description: string
    label: string
}

export const getLevel = (levelRange: [number, number][], score: number) => {
    return levelRange.findIndex((range, index) =>
        index === levelRange.length - 1
            ? true
            : score >= range[0] && score < range[1]
    )
}

interface Props {
    children: React.ReactNode
}

const AchievementWrapper = ({ children }: Props) => {
    const { projectId } = useRouter().query
    const { data: sprints, isLoading: milestonesLoading } = useQuery(
        ['milestones', { projectId }],
        async (key, { projectId }) => {
            return getMilestones({
                closed: false,
                projectId: projectId as string,
            })
        },
        { enabled: projectId }
    )

    const { data: tasks = [], isLoading: tasksLoading } = useQuery(
        ['tasks', { projectId }],
        async (key, { projectId }) => {
            const tasks = await getTasks({ projectId })
            return tasks.filter((t) => t.user_story === null)
        },
        { enabled: projectId }
    )

    const { data: stories, isLoading: storiesLoading } = useQuery(
        ['userstories', { projectId }],
        (key, { projectId }) => getUserstories({ projectId }),
        { enabled: projectId }
    )

    const closedSprints =
        sprints?.filter((sprint) => sprint.closed)?.length ?? -1
    const closedBugs =
        stories && tasks
            ? [...stories, ...tasks].filter(
                  (issue) =>
                      issue.is_closed &&
                      issue.tags.find(
                          (tag) => tag.length && tag[0].includes('bug')
                      )
              ).length
            : -1

    const closedIssues =
        stories && tasks
            ? [...stories, ...tasks].filter((issue) => issue.is_closed).length
            : -1

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
        : -1

    const comments =
        stories?.reduce((prev, curr) => prev + curr.total_comments, 0) ?? -1

    const tags =
        stories && tasks
            ? [...stories, ...tasks].reduce(
                  (prev, curr) => prev + curr.tags.length,
                  0
              )
            : -1
    const achievements = [
        {
            score: comments,
            levelRange: [
                [0, 1],
                [1, 10],
                [10, 50],
                [50, 500],
            ],
            icon: <CommentOutlined />,
            title: 'Author',
            label: 'Comments',
            description: 'Comment on issues to advance this achievement.',
        },
        {
            score: closedSprints,
            levelRange: [
                [0, 1],
                [1, 5],
                [5, 20],
                [20, 50],
            ],
            icon: <DashboardOutlined />,
            title: 'Sprinter',
            label: 'Sprints',
            description: 'Close sprints to advance this achievement.',
        },
        {
            score: tags,
            levelRange: [
                [0, 1],
                [1, 10],
                [10, 50],
                [50, 200],
            ],
            icon: <TagsOutlined />,
            title: 'Sale!',
            label: 'Tags',
            description: 'Tag your issues to advance this achievement.',
        },
        {
            score: closedBugs,
            levelRange: [
                [0, 1],
                [1, 10],
                [10, 50],
                [50, 200],
            ],
            icon: <BugOutlined />,
            title: 'Bug Basher',
            label: 'Bugs',
            description: 'Close bugs to advance this achievement.',
        },
        {
            score: storyPoints,
            levelRange: [
                [0, 10],
                [10, 50],
                [50, 200],
                [200, 1000],
            ],
            icon: <FireOutlined />,
            title: 'Burn it down!',
            label: 'Story Points',
            description:
                'Burn down a certain amount of story points to advance this achievement.',
        },
        {
            score: 1,
            levelRange: [
                [0, 1],
                [1, 10],
                [10, 50],
                [50, 500],
            ],
            icon: <NumberOutlined />,
            title: 'Even the Odds',
            label: 'Dunno',
            description: 'Dont know yet.',
        },
        {
            score: closedIssues,
            levelRange: [
                [0, 10],
                [10, 50],
                [50, 200],
                [200, 500],
            ],
            icon: <RobotOutlined />,
            title: 'Ticket Machine',
            label: 'Issues',
            description:
                'Close a certain amount of issues to advance this achievement.',
        },
    ] as Achievement[]

    const prevAchievements = usePrev(achievements)

    useEffect(() => {
        if (projectId) {
            achievements.forEach((achievement, index) => {
                const prevAchievement = prevAchievements[index]
                if (prevAchievement.score >= 0) {
                    if (achievement.score > prevAchievement.score) {
                        console.log(achievement.title, achievement.score, prevAchievement.score)
                    }
                    const oldLevel = getLevel(
                        prevAchievement.levelRange,
                        prevAchievement.score
                    )
                    const newLevel = getLevel(
                        achievement.levelRange,
                        achievement.score
                    )
                    if (newLevel > oldLevel) {
                        notification.open({
                            message: `${achievement.title} Level ${newLevel}`,
                            description: `You leveled up your ${achievement.label} Achievement!`,
                            icon: achievement.icon,
                        })
                    }
                }
            })
        }
    }, [achievements, prevAchievements])

    const totalScore = achievements.reduce(
        (prev, curr) => prev + getLevel(curr.levelRange, curr.score) * 10,
        0
    )
    return (
        <AchievementContext.Provider
            value={{
                achievements,
                isLoading: milestonesLoading && tasksLoading && storiesLoading,
                totalLevelRange: [
                    [0, 50],
                    [50, 200],
                    [200, 500],
                    [500, 1000],
                    [1000, 2000],
                    [2000, 5000],
                    [5000, 10000],
                    [10000, 200000],
                ],
                totalScore,
            }}
        >
            {children}
        </AchievementContext.Provider>
    )
}

export default AchievementWrapper
