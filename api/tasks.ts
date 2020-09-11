import authInstance from '../util/axiosInstance'
import { User } from './users'
import { Project } from './projects'

export interface TaskStatus {
    id: number
    name: string
    color: string
    count: number
    order: number
    is_closed: boolean
}

type TinyUser = { id: string | null, full_name: string, count: number }
export interface TaskFiltersData {
    assigned_to: TinyUser[]
    owners: TinyUser[]
    roles: TaskStatus[]
    statuses: TaskStatus[]
    tags: []
}
export interface Task {
    assigned_to: string | null
    assigned_to_extra_info: string | null
    attachments: any[]
    blocked_note: string
    created_date: string
    due_date: null
    due_date_reason: string
    due_date_status: string
    external_reference: null
    finished_date: null
    id: number
    is_blocked: false
    is_closed: false
    is_iocaine: false
    is_voter: false
    is_watcher: false
    milestone: number
    milestone_slug: string
    modified_date: string
    owner: number
    owner_extra_info: User
    project: number
    project_extra_info: Project
    ref: number
    status: number
    status_extra_info: TaskStatus
    subject: string
    tags: string[]
    taskboard_order: number
    total_comments: number
    total_voters: number
    total_watchers: number
    us_order: number
    user_story: number
    user_story_extra_info: { id: number, ref: number, subject: string, epics: null | string[] }
    version: number
    watchers: string[]
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

    return authInstance.get<Task[]>('/tasks', { params }).then(res => res.data)
}

export const createTask = (data: any) => {
    return authInstance.post<Task>('/tasks', data).then(res => res.data)
}

export const getTask = (id: string) => {
    return authInstance.get<Task>(`/tasks/${id}`).then(res => res.data)
}

export const replaceTask = (id: string, data: any) => {
    return authInstance.put<Task>(`/tasks/${id}`, data).then(res => res.data)
}

export const updateTask = (id: string, data: any) => {
    return authInstance.patch<Task>(`/tasks/${id}`, data).then(res => res.data)
}

export const deleteTask = (id: string) => {
    return authInstance.delete<Task>(`/tasks/${id}`).then(res => res.data)
}

export const getFiltersData = (projectId: string) => {
    return authInstance.get<TaskStatus[]>(`/tasks/filters_data?project=${projectId}`).then(res => res.data)
}

export const upvoteTask = (id: string) => {
    return authInstance.post(`/tasks/${id}/upvote`).then(res => res.data)
}

export const downvoteTask = (id: string) => {
    return authInstance.post(`/tasks/${id}/downvote`).then(res => res.data)
}

export const voters = (id: string) => {
    return authInstance.get(`/tasks/${id}/voters`).then(res => res.data)
}

export const watchTask = (id: string) => {
    return authInstance.post(`/tasks/${id}/watch`).then(res => res.data)
}

export const unwatchTask = (id: string) => {
    return authInstance.post(`/tasks/${id}/unwatch`).then(res => res.data)
}

export const getTaskWatchers = (id: string) => {
    return authInstance.get(`/tasks/${id}/watchers`).then(res => res.data)
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
    return authInstance.get(`/tasks/attachments/`, { params }).then(res => res.data)
}

export const createTaskAttachment = (data: any) => {
    return authInstance.post(`/tasks/attachments`, data).then(res => res.data)
}

export const getTaskAttachment = (attachmentId: string) => {
    return authInstance.get(`/tasks/attachments/${attachmentId}`).then(res => res.data)
}

export const replaceTaskAttachment = (attachmentId: string, data: any) => {
    return authInstance.put(`/tasks/attachments/${attachmentId}`, data).then(res => res.data)
}

export const updateTaskAttachment = (attachmentId: string, data: any) => {
    return authInstance.patch(`/tasks/attachments/${attachmentId}`, data).then(res => res.data)
}

export const deleteTaskAttachment = (attachmentId: string) => {
    return authInstance.delete(`/tasks/attachments/${attachmentId}`).then(res => res.data)
}
