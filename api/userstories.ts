import authInstance from '../util/axiosInstance'
import { Task } from './tasks'
import { User } from './users'

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
    tags: []
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
    projectId?: string
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
    projectId && params.append('project', projectId)
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

    return authInstance.get('/userstories', { params })
}

export const createUserstory = (data: any) => {
    return authInstance.post('/userstories', data)
}

export const getUserstory = (id: string) => {
    return authInstance.get(`/userstories/${id}`)
}

export const replaceUserstory = (id: string, data: any) => {
    return authInstance.put(`/userstories/${id}/`)
}

export const updateUserstory = (id: string, data: any) => {
    return authInstance.patch(`/userstories/${id}/`)
}

export const deleteUserstory = (id: string) => {
    return authInstance.delete(`/userstories/${id}/`)
}

export const getFiltersData = (projectId: string) => {
    return authInstance.get(`/userstories/filters_data?project=${projectId}`)
}

export const upvoteUserstory = (id: string) => {
    return authInstance.post(`/userstories/${id}/upvote`)
}

export const downvoteUserstory = (id: string) => {
    return authInstance.post(`/userstories/${id}/downvote`)
}

export const voters = (id: string) => {
    return authInstance.get(`/userstories/${id}/voters`)
}

export const watchUserstory = (id: string) => {
    return authInstance.post(`/userstories/${id}/watch`)
}

export const unwatchUserstory = (id: string) => {
    return authInstance.post(`/userstories/${id}/unwatch`)
}

export const getUserstoryWatchers = (id: string) => {
    return authInstance.get(`/userstories/${id}/watchers`)
}

export const getUserstoryAttachments = ({
    projectId,
    userstoryId,
}: {
    projectId?: string
    userstoryId?: string
}) => {
    const params = new URLSearchParams()
    projectId && params.append('project', projectId)
    userstoryId && params.append('object_id', userstoryId)

    return authInstance.get(`/userstories/attachments`, { params })
}

export const createUserstoryAttachment = (data: any) => {
    return authInstance.post(`/userstories/attachments`, data)
}

export const getUserstoryAttachment = (attachmentId: string) => {
    return authInstance.get(`/userstories/attachments/${attachmentId}`)
}

export const replaceUserstoryAttachment = (attachmentId: string, data: any) => {
    return authInstance.put(`/userstories/attachments/${attachmentId}`, data)
}

export const updateUserstoryAttachment = (attachmentId: string, data: any) => {
    return authInstance.patch(`/userstories/attachments/${attachmentId}`, data)
}

export const deleteUserstoryAttachment = (attachmentId: string) => {
    return authInstance.delete(`/userstories/attachments/${attachmentId}`)
}
