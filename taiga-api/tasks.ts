import { authInstance } from '../util/axiosInstance'
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

type TinyUser = { id: number | null; full_name: string; count: number }

type Assignee = {
    big_photo: string
    full_name_display: string
    gravatar_id: string
    id: number
    is_active: boolean
    photo: string
    username: string
}
export interface TaskFiltersData {
    assigned_to: TinyUser[]
    owners: TinyUser[]
    roles: TaskStatus[]
    statuses: TaskStatus[]
    tags: [string, string][]
}

export interface Attachment {
    attached_file: string
    created_date: string
    description: string
    from_comment: boolean
    id: number
    is_deprecated: boolean
    modified_date: string
    name: string
    object_id: number
    order: number
    owner: number
    preview_url: string
    project: number
    sha1: string
    size: number
    thumbnail_card_url: string
    url: string
}
export interface Task {
    assigned_to: number | null
    assigned_to_extra_info: Assignee | null
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
    description?: string
    tags: [string, string][]
    taskboard_order: number
    total_comments: number
    total_voters: number
    total_watchers: number
    us_order: number
    user_story: number
    user_story_extra_info: {
        id: number
        ref: number
        subject: string
        epics: null | string[]
    }
    version: number
    watchers: string[]
}

export interface TaskStatus {
    color: string
    id: number
    is_closed: boolean
    name: string
    order: number
    project: number
}

export const getTasks = ({
    projectId,
    status,
    tags,
    userStory,
    role,
    owner,
    milestone,
    milestoneIsNull,
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
    milestoneIsNull?: boolean
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
    milestoneIsNull &&
        params.append('milestone__isnull', milestoneIsNull.toString())

    status && params.append('status', status)
    owner && params.append('owner', owner)
    tags && params.append('tags', tags.toString())
    watchers && params.append('watchers', watchers)
    assignedTo && params.append('assigned_to', assignedTo)
    userStory && params.append('user_story', userStory.toString())
    role && params.append('role', role)
    statusIsClosed &&
        params.append('status__is_closed', statusIsClosed.toString())
    excludeStatus && params.append('exclude_status', excludeStatus)
    excludeTags && params.append('exclude_tags', excludeTags.toString())
    excludeAssignedTo && params.append('exclude_assigned_to', excludeAssignedTo)
    excludeRole && params.append('exclude_role', excludeRole)
    excludeOwner && params.append('exclude_owner', excludeOwner)

    return authInstance
        .get<Task[]>('/tasks', { params })
        .then((res) => res.data)
}

export const createTask = (data: any) => {
    return authInstance.post<Task>('/tasks', data).then((res) => res.data)
}

export const getTask = (id: number) => {
    return authInstance.get<Task>(`/tasks/${id}`).then((res) => res.data)
}

export const replaceTask = (id: number, data: any) => {
    return authInstance.put<Task>(`/tasks/${id}`, data).then((res) => res.data)
}

export const updateTask = (id: number, data: any) => {
    return authInstance
        .patch<Task>(`/tasks/${id}`, data)
        .then((res) => res.data)
}

export const deleteTask = (id: number) => {
    return authInstance.delete<Task>(`/tasks/${id}`).then((res) => res.data)
}

export const getFiltersData = (projectId: string) => {
    return authInstance
        .get<TaskFiltersData>(`/tasks/filters_data?project=${projectId}`)
        .then((res) => res.data)
}

export const upvoteTask = (id: number) => {
    return authInstance.post(`/tasks/${id}/upvote`).then((res) => res.data)
}

export const downvoteTask = (id: number) => {
    return authInstance.post(`/tasks/${id}/downvote`).then((res) => res.data)
}

export const voters = (id: number) => {
    return authInstance.get(`/tasks/${id}/voters`).then((res) => res.data)
}

export const watchTask = (id: number) => {
    return authInstance.post(`/tasks/${id}/watch`).then((res) => res.data)
}

export const unwatchTask = (id: number) => {
    return authInstance.post(`/tasks/${id}/unwatch`).then((res) => res.data)
}

export const getTaskWatchers = (id: number) => {
    return authInstance.get(`/tasks/${id}/watchers`).then((res) => res.data)
}

export const getTaskAttachments = ({
    projectId,
    taskId,
}: {
    projectId?: number
    taskId?: number
}) => {
    const params = new URLSearchParams()
    projectId && params.append('project', projectId.toString())
    taskId && params.append('object_id', taskId.toString())
    return authInstance
        .get<Attachment[]>(`/tasks/attachments`, { params })
        .then((res) => res.data)
}

export const createTaskAttachment = (data: any) => {
    return authInstance
        .post<Attachment>(`/tasks/attachments`, data)
        .then((res) => res.data)
}

export const getTaskAttachment = (attachmentId: number) => {
    return authInstance
        .get<Attachment>(`/tasks/attachments/${attachmentId}`)
        .then((res) => res.data)
}

export const replaceTaskAttachment = (attachmentId: number, data: any) => {
    return authInstance
        .put<Attachment>(`/tasks/attachments/${attachmentId}`, data)
        .then((res) => res.data)
}

export const updateTaskAttachment = (attachmentId: number, data: any) => {
    return authInstance
        .patch<Attachment>(`/tasks/attachments/${attachmentId}`, data)
        .then((res) => res.data)
}

export const deleteTaskAttachment = (attachmentId: number) => {
    return authInstance
        .delete<Attachment>(`/tasks/attachments/${attachmentId}`)
        .then((res) => res.data)
}

export const promoteToUserstory = (id: number, projectId: string) => {
    return authInstance.post(`/tasks/${id}/promote_to_user_story`, {
        project_id: projectId,
    })
}

export const getTaskStatuses = (projectId: string) => {
    return authInstance
        .get<TaskStatus[]>(`/task-statuses?project=${projectId}`)
        .then((res) => res.data)
}

export const updateTaskStatus = (id: number, data: any) => {
    return authInstance
        .patch<TaskStatus>(`/task-statuses/${id}`, data)
        .then((res) => res.data)
}

export const createTaskStatus = (
    projectId: number,
    data: {
        color?: string
        name: string
        order: number
        is_archived?: boolean
        is_closed: boolean
    }
) => {
    return authInstance
        .post<TaskStatus>(`/task-statuses`, { ...data, project: projectId })
        .then((res) => res.data)
}

export const deleteTaskStatus = (id: number) => {
    return authInstance.delete(`/task-statuses/${id}`).then((res) => res.data)
}
