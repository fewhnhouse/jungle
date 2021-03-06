import {
    BugOutlined,
    CommentOutlined,
    DashboardOutlined,
    FireOutlined,
    NumberOutlined,
    RobotOutlined,
    TagsOutlined,
} from '@ant-design/icons'
import { Divider, notification } from 'antd'
import { useRouter } from 'next/router'
import { createContext, useEffect } from 'react'
import { useQuery } from 'react-query'
import Flex from '../components/Flex'
import LevelDisplay from '../components/LevelDisplay/LevelDisplay'
import { getMilestones } from '../taiga-api/milestones'
import { getProject } from '../taiga-api/projects'
import { getTasks } from '../taiga-api/tasks'
import { getUserstories } from '../taiga-api/userstories'
import usePrev from './usePrev'

export const AchievementContext = createContext({
    achievements: [],
    isLoading: false,
    totalLevelRange: [],
    totalScore: 0,
})

interface LocalAchievement {
    id: number
    level: number
}

export interface Achievement {
    id: number
    score: number
    levelRange: [number, number][]
    icon: React.ReactNode
    title: React.ReactNode
    description: string
    label: string
}

export const getLevel = (levelRange: [number, number][], score: number) => {
    if (!score || score <= 0) return 0
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

    const { data: project } = useQuery(
        ['project', { projectId }],
        (key, { projectId }) => getProject(projectId),
        { enabled: projectId }
    )
    const {
        data: sprints,
        isLoading: milestonesLoading,
        isFetchedAfterMount: isMilestonesFetched,
    } = useQuery(
        ['milestones', { projectId }],
        async (key, { projectId }) => {
            return getMilestones({
                closed: false,
                projectId: projectId as string,
            })
        },
        { enabled: projectId }
    )

    const {
        data: tasks,
        isLoading: tasksLoading,
        isFetchedAfterMount: isTasksFetched,
    } = useQuery(
        ['tasks', { projectId }],
        async (key, { projectId }) => getTasks({ projectId }),
        { enabled: projectId }
    )

    const {
        data: stories,
        isLoading: storiesLoading,
        isFetchedAfterMount: isStoriesFetched,
    } = useQuery(
        ['userstories', { projectId }],
        (key, { projectId }) => getUserstories({ projectId }),
        { enabled: projectId }
    )

    const isLoading = milestonesLoading || tasksLoading || storiesLoading
    const isFetched = isMilestonesFetched && isTasksFetched && isStoriesFetched

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

    const storyPoints =
        stories
            ?.filter((story) => story.is_closed)
            .reduce(
                (prev, curr) =>
                    prev +
                    Object.values(curr.points).reduce(
                        (prevPoint, currPoint) => {
                            const point = project?.points.find(
                                (point) => point.id === currPoint
                            )
                            return prevPoint + (point.value ?? 0)
                        },
                        0
                    ),
                0
            ) ?? -1

    const subtasks =
        tasks?.reduce((prev, curr) => {
            return prev + (curr.user_story !== null ? 1 : 0)
        }, 0) ?? -1

    const comments =
        stories && tasks
            ? [...stories, ...tasks].reduce(
                  (prev, curr) => prev + curr.total_comments,
                  0
              )
            : -1

    const tags =
        stories && tasks
            ? [...stories, ...tasks].reduce(
                  (prev, curr) => prev + curr.tags.length,
                  0
              )
            : -1

    const achievements = [
        {
            id: 1,
            score: comments,
            levelRange: [
                [0, 1],
                [1, 10],
                [10, 100],
                [100, 500],
            ],
            icon: <CommentOutlined />,
            title: 'Author',
            label: 'Comments',
            description: 'Comment on issues to advance this achievement.',
        },
        {
            id: 2,
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
            id: 3,
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
            id: 4,
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
            id: 5,
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
            id: 6,
            score: subtasks,
            levelRange: [
                [0, 5],
                [5, 20],
                [20, 100],
                [100, 500],
            ],
            icon: <NumberOutlined />,
            title: 'Divide and Conquer',
            label: 'Subtasks',
            description:
                'Create subtasks to further divide user stories to advance this achievement.',
        },
        {
            id: 7,
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
    const totalScore = achievements.reduce(
        (prev, curr) => prev + getLevel(curr.levelRange, curr.score) * 10,
        0
    )

    const totalLevelRange: [number, number][] = [
        [0, 50],
        [50, 200],
        [200, 500],
        [500, 1000],
        [1000, 2000],
        [2000, 5000],
        [5000, 10000],
        [10000, 200000],
    ]

    useEffect(() => {
        if (projectId && isFetched) {
            achievements?.forEach((achievement, index) => {
                const prevAchievement = prevAchievements[index]
                if (prevAchievement.score >= 0) {
                    const oldLevel = getLevel(
                        prevAchievement.levelRange,
                        prevAchievement.score
                    )
                    const newLevel = getLevel(
                        achievement.levelRange,
                        achievement.score
                    )
                    try {
                        const existingAchievements: LocalAchievement[] =
                            JSON.parse(localStorage.getItem('achievements')) ??
                            []
                        const existingAchievement = existingAchievements?.find(
                            (existing) => existing.id === achievement.id
                        )
                        const isExisting =
                            existingAchievement &&
                            newLevel <= existingAchievement?.level
                        if (newLevel > oldLevel && !isExisting) {
                            localStorage.setItem(
                                'achievements',
                                JSON.stringify(
                                    existingAchievement
                                        ? existingAchievements.map((existing) =>
                                              existing.id === achievement.id
                                                  ? {
                                                        id: existing.id,
                                                        level: newLevel,
                                                    }
                                                  : existing
                                          )
                                        : [
                                              ...existingAchievements,
                                              {
                                                  id: achievement.id,
                                                  level: newLevel,
                                              },
                                          ]
                                )
                            )
                            notification.open({
                                message: `${achievement.title} Level ${newLevel}`,
                                description: (
                                    <Flex direction="column">
                                        <span>
                                            You leveled up your{' '}
                                            {achievement.label} Achievement in{' '}
                                            {project?.name}!
                                        </span>
                                        <Divider
                                            style={{
                                                margin: '0px',
                                                marginTop: 5,
                                            }}
                                        >
                                            Team Level
                                        </Divider>

                                        <LevelDisplay
                                            totalLevelRange={totalLevelRange}
                                            totalScore={totalScore}
                                            size="small"
                                        />
                                    </Flex>
                                ),
                                icon: achievement.icon,
                            })
                        }
                    } catch (err) {
                        console.error(err)
                    }
                }
            })
        }
    }, [achievements, prevAchievements])

    return (
        <AchievementContext.Provider
            value={{
                achievements,
                isLoading: isLoading,
                totalLevelRange,
                totalScore,
            }}
        >
            {children}
        </AchievementContext.Provider>
    )
}

export default AchievementWrapper
