import { queryCache } from 'react-query'
import { Milestone } from './taiga-api/milestones'
import { Task } from './taiga-api/tasks'
import { UserStory } from './taiga-api/userstories'

// updates the cache on board and backlog for userstories
export const updateUserstoryCache = (
    updatedStory: UserStory,
    id: number,
    projectId: string
) => {
    queryCache.setQueryData(['userstory', { id }], () => updatedStory)
    queryCache.setQueryData(
        ['backlog', { projectId }],
        (prevData: UserStory[]) =>
            prevData?.map((story) => (story.id === id ? updatedStory : story))
    )
    queryCache.setQueryData(
        ['milestones', { projectId }],
        (prevData: Milestone[]) =>
            prevData?.map((ms) => ({
                ...ms,
                user_stories: ms.user_stories.map((story) =>
                    story.id === id ? updatedStory : story
                ),
            }))
    )
}

export const updateTaskCache = (
    updatedTask: Task,
    id: number,
    projectId: string
) => {
    queryCache.setQueryData(['task', { id }], () => updatedTask)
    queryCache.setQueryData(['tasks', { projectId }], (prevData: Task[]) =>
        prevData?.map((task) => (task.id === id ? updatedTask : task))
    )
}
