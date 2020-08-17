import authInstance from '../util/axiosInstance'

export interface Task {
    id: number
    ref: number
    subject: string
    status_id: number
}

export const getTasks = () => {
    return authInstance.get('/tasks')
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

export const getAttachments = () => {
    return authInstance.get(`/tasks/attachments`)
}

export const createTaskAttachment = (data: any) => {
    return authInstance.post(`/tasks/attachments`, data)
}

export const getTaskAttachments = (attachmentId: string) => {
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
