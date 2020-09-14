import authInstance from '../util/axiosInstance'
import { Task } from './tasks'
import { User } from './users'

export interface StoryStatus {
    id: number
    name: string
    color: string
    is_closed: boolean
}

export interface UserStory {
    assigned_to: null
    assigned_to_extra_info: null
    assigned_users: []
    attachments: []
    backlog_order: number
    blocked_note: string
    client_requirement: boolean
    comment: string
    created_date: string
    due_date: null
    due_date_reason: string
    due_date_status: string
    epic_order: null
    epics: null
    external_reference: null
    finish_date: null
    generated_from_issue: null
    generated_from_task: null
    id: number
    is_blocked: boolean
    is_closed: boolean
    is_voter: boolean
    is_watcher: boolean
    kanban_order: number
    milestone: null | number
    milestone_name: null | string
    milestone_slug: null | string
    modified_date: string
    origin_issue: null
    origin_task: null
    owner: number
    owner_extra_info: User
    points: any
    project: number
    project_extra_info: {
        name: string
        slug: string
        logo_small_url: null
        id: 1
    }
    ref: number
    sprint_order: number
    status: number
    status_extra_info: { name: string; color: string; is_closed: boolean }
    subject: string
    description?: string
    tags: [string, string][]
    tasks: Task[]
    team_requirement: boolean
    total_attachments: number
    total_comments: number
    total_points: null
    total_voters: number
    total_watchers: number
    tribe_gig: null
    version: number
    watchers: number[]
}

export const getUserstories = ({
    projectId,
    milestone,
    milestoneIsNull,
    status,
    statusIsArchived,
    tags,
    watchers,
    assignedTo,
    epic,
    role,
    statusIsClosed,
    excludeStatus,
    excludeTags,
    excludeAssignedTo,
    excludeRole,
    excludeEpic,
}: {
    projectId?: number
    milestone?: string
    milestoneIsNull?: boolean
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
    excludeEpic?: string
}) => {
    const params = new URLSearchParams()
    projectId && params.append('project', projectId.toString())
    milestone && params.append('milestone', milestone)
    milestoneIsNull &&
        params.append('milestone__isnull', milestoneIsNull.toString())
    status && params.append('status', status)
    statusIsArchived &&
        params.append('status__is_archived', statusIsArchived.toString())
    tags && params.append('tags', tags.toString())
    watchers && params.append('watchers', watchers)
    assignedTo && params.append('assigned_to', assignedTo)
    epic && params.append('epic', epic)
    role && params.append('role', role)
    statusIsClosed &&
        params.append('status__is_closed', statusIsClosed.toString())
    excludeStatus && params.append('exclude_status', excludeStatus)
    excludeTags && params.append('exclude_tags', excludeTags.toString())
    excludeAssignedTo && params.append('exclude_assigned_to', excludeAssignedTo)
    excludeRole && params.append('exclude_role', excludeRole)
    excludeEpic && params.append('exclude_epic', excludeEpic)

    return authInstance.get<UserStory[]>('/userstories', { params }).then(res => res.data)
}

export const createUserstory = (data: any) => {
    return authInstance.post<UserStory>('/userstories', data).then(res => res.data)
}

export const getUserstory = (id: number) => {
    return authInstance.get<UserStory>(`/userstories/${id}`).then(res => res.data)
}

export const replaceUserstory = (id: number, data: any) => {
    return authInstance.put<UserStory>(`/userstories/${id}`, data).then(res => res.data)
}

export const updateUserstory = (id: number, data: any) => {
    return authInstance.patch<UserStory>(`/userstories/${id}`, data).then(res => res.data)
}

export const deleteUserstory = (id: number) => {
    return authInstance.delete<UserStory>(`/userstories/${id}`).then(res => res.data)
}

export const getFiltersData = (projectId: number) => {
    return authInstance.get(`/userstories/filters_data?project=${projectId}`).then(res => res.data)
}

export const upvoteUserstory = (id: number) => {
    return authInstance.post(`/userstories/${id}/upvote`).then(res => res.data)
}

export const downvoteUserstory = (id: number) => {
    return authInstance.post(`/userstories/${id}/downvote`).then(res => res.data)
}

export const voters = (id: number) => {
    return authInstance.get(`/userstories/${id}/voters`).then(res => res.data)
}

export const watchUserstory = (id: number) => {
    return authInstance.post(`/userstories/${id}/watch`).then(res => res.data)
}

export const unwatchUserstory = (id: number) => {
    return authInstance.post(`/userstories/${id}/unwatch`).then(res => res.data)
}

export const getUserstoryWatchers = (id: number) => {
    return authInstance.get(`/userstories/${id}/watchers`)
}

export const getUserstoryAttachments = ({
    projectId,
    userstoryId,
}: {
    projectId?: number
    userstoryId?: number
}) => {
    const params = new URLSearchParams()
    projectId && params.append('project', projectId.toString())
    userstoryId && params.append('object_id', userstoryId.toString())

    return authInstance.get(`/userstories/attachments`, { params }).then(res => res.data)
}

export const createUserstoryAttachment = (data: any) => {
    return authInstance.post(`/userstories/attachments`, data).then(res => res.data)
}

export const getUserstoryAttachment = (attachmentId: number) => {
    return authInstance.get(`/userstories/attachments/${attachmentId}`).then(res => res.data)
}

export const replaceUserstoryAttachment = (attachmentId: number, data: any) => {
    return authInstance.put(`/userstories/attachments/${attachmentId}`, data).then(res => res.data)
}

export const updateUserstoryAttachment = (attachmentId: number, data: any) => {
    return authInstance.patch(`/userstories/attachments/${attachmentId}`, data).then(res => res.data)
}

export const deleteUserstoryAttachment = (attachmentId: number) => {
    return authInstance.delete(`/userstories/attachments/${attachmentId}`).then(res => res.data)
}
