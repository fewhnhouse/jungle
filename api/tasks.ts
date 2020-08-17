import authInstance from '../util/axiosInstance'

export interface Task {
    id: number
    ref: number
    subject: string
    status_id: number
}

export const getTasks = ({
    projectId,
    status,
    tags,
    userStory,
    role,
    owner,
    milestone,
    watchers,
    assignedTo,
    statusIsClosed,
    excludeStatus,
    excludeTags,
    excludeRole,
    excludeOwner,
    excludeAssignedTo,
}: {
    projectId?: string
    milestone?: string
    userStory?: string
    owner?: string
    status?: string
    statusIsArchived?: boolean
    tags?: string[]
    watchers?: string
    assignedTo?: string
    epic?: string
    role?: string
    statusIsClosed?: boolean
    excludeStatus?: string
    excludeTags?: string[]
    excludeAssignedTo?: string
    excludeRole?: string
    excludeOwner?: string
    excludeEpic?: string
}) => {
    const params = new URLSearchParams()
    projectId && params.append('project', projectId)
    milestone && params.append('milestone', milestone)
    status && params.append('status', status)
    owner && params.append('owner', owner)
    tags && params.append('tags', tags.toString())
    watchers && params.append('watchers', watchers)
    assignedTo && params.append('assigned_to', assignedTo)
    userStory && params.append('user_story', userStory)
    role && params.append('role', role)
    statusIsClosed &&
        params.append('status__is_closed', statusIsClosed.toString())
    excludeStatus && params.append('exclude_status', excludeStatus)
    excludeTags && params.append('exclude_tags', excludeTags.toString())
    excludeAssignedTo && params.append('exclude_assigned_to', excludeAssignedTo)
    excludeRole && params.append('exclude_role', excludeRole)
    excludeOwner && params.append('exclude_owner', excludeOwner)

    return authInstance.get('/tasks', { params })
}

export const createTask = (data: any) => {
    return authInstance.post('/tasks', data)
}

export const getTask = (id: string) => {
    return authInstance.get(`/tasks/${id}`)
}

export const replaceTask = (id: string, data: any) => {
    return authInstance.put(`/tasks/${id}/`)
}

export const updateTask = (id: string, data: any) => {
    return authInstance.patch(`/tasks/${id}/`)
}

export const deleteTask = (id: string) => {
    return authInstance.delete(`/tasks/${id}/`)
}

export const getFiltersData = (projectId: string) => {
    return authInstance.get(`/tasks/filters_data?project=${projectId}`)
}

export const upvoteTask = (id: string) => {
    return authInstance.post(`/tasks/${id}/upvote`)
}

export const downvoteTask = (id: string) => {
    return authInstance.post(`/tasks/${id}/downvote`)
}

export const voters = (id: string) => {
    return authInstance.get(`/tasks/${id}/voters`)
}

export const watchTask = (id: string) => {
    return authInstance.post(`/tasks/${id}/watch`)
}

export const unwatchTask = (id: string) => {
    return authInstance.post(`/tasks/${id}/unwatch`)
}

export const getTaskWatchers = (id: string) => {
    return authInstance.get(`/tasks/${id}/watchers`)
}

export const getTaskAttachments = ({
    projectId,
    userstoryId,
}: {
    projectId?: string
    userstoryId?: string
}) => {
    const params = new URLSearchParams()
    projectId && params.append('project', projectId)
    userstoryId && params.append('object_id', userstoryId)
    return authInstance.get(`/tasks/attachments/`, { params })
}

export const createTaskAttachment = (data: any) => {
    return authInstance.post(`/tasks/attachments`, data)
}

export const getTaskAttachment = (attachmentId: string) => {
    return authInstance.get(`/tasks/attachments/${attachmentId}`)
}

export const replaceTaskAttachment = (attachmentId: string, data: any) => {
    return authInstance.put(`/tasks/attachments/${attachmentId}`, data)
}

export const updateTaskAttachment = (attachmentId: string, data: any) => {
    return authInstance.patch(`/tasks/attachments/${attachmentId}`, data)
}

export const deleteTaskAttachment = (attachmentId: string) => {
    return authInstance.delete(`/tasks/attachments/${attachmentId}`)
}
