import { notification } from 'antd'
import { useRouter } from 'next/router'
import { createContext, useEffect } from 'react'
import { useQuery } from 'react-query'
import { getMilestones } from '../../taiga-api/milestones'
import { getTasks } from '../../taiga-api/tasks'
import { getUserstories } from '../../taiga-api/userstories'
import usePrev from '../../util/usePrev'

interface Props {
    children: React.ReactNode
}

export const AchievementContext = createContext({
    closedSprints: 0,
    closedBugs: 0,
    closedIssues: 0,
    storyPoints: 0,
    comments: 0,
    tags: 0,
    loading: false,
})

export default function NotificationProvider({ children }: Props) {
    const { projectId } = useRouter().query
    const { data: sprints = [], isLoading: milestonesLoading } = useQuery(
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
    const achievements = {
        comments,
        tags,
        storyPoints,
        closedIssues,
        closedSprints,
        closedBugs,
    }

    const loading = tasksLoading && milestonesLoading && storiesLoading
    return (
        <AchievementContext.Provider
            value={{
                ...achievements,
                loading,
            }}
        >
            {children}
        </AchievementContext.Provider>
    )
}

const getLevel = (levelRange: [number, number][], score: number) => {
    return levelRange.findIndex((range, index) =>
        index === levelRange.length - 1
            ? true
            : score >= range[0] && score < range[1]
    )
}

const NotificationTracker = ({
    score,
    levelRange,
    title,
    label,
    icon,
    level,
}: {
    score: number
    level: number
    levelRange: [number, number][]
    title: string
    label: string
    icon: React.ReactNode
}) => {
    const prevScore = usePrev(score)
    useEffect(() => {
        if (!!prevScore && score > prevScore) {
            const oldLevel = getLevel(levelRange, prevScore)
            const newLevel = getLevel(levelRange, score)
            if (newLevel > oldLevel) {
                notification.open({
                    message: `${title} Level ${level}`,
                    description: `You leveled up your ${label} Achievement!`,
                    icon,
                })
            }
        }
    }, [score, prevScore])
    return null
}
