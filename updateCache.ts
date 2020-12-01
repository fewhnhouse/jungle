import { QueryCache } from 'react-query'
import { Milestone } from './taiga-api/milestones'
import { Task } from './taiga-api/tasks'
import { UserStory } from './taiga-api/userstories'

// updates the cache on board and backlog for userstories
export const updateUserstoryCache = (
    updatedStory: UserStory,
    id: number,
    projectId: string,
    queryCache: QueryCache
) => {
    queryCache.setQueryData(['userstory', { id }], () => updatedStory)
    queryCache.setQueryData(
        ['userstories', { projectId }],
        (prevData: UserStory[]) =>
            prevData?.map((story) => (story.id === id ? updatedStory : story))
    )
}

export const updateTaskCache = (
    updatedTask: Task,
    id: number,
    projectId: string,
    queryCache: QueryCache
) => {
    queryCache.setQueryData(['task', { id }], () => updatedTask)
    queryCache.setQueryData(['tasks', { projectId }], (prevData: Task[]) =>
        prevData?.map((task) => (task.id === id ? updatedTask : task))
    )
}
