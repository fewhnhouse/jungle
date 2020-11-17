import { authInstance } from '../util/axiosInstance'

export const getIssues = ({
    projectId,
    status,
    severity,
    priority,
    owner,
    assignedTo,
    tags,
    type,
    role,
    watchers,
    statusIsClosed,
    excludeStatus,
    excludeSeverity,
    excludePriority,
    excludeOwner,
    excludeAssignedTo,
    excludeTags,
    excludeType,
    excludeRole,
}: {
    projectId?: string
    severity?: string
    priority?: string
    status?: string
    owner?: string
    type?: string
    tags?: string[]
    watchers?: string
    assignedTo?: string
    role?: string
    statusIsClosed?: boolean
    excludeStatus?: string
    excludeSeverity?: string
    excludePriority?: string
    excludeOwner?: string
    excludeTags?: string[]
    excludeAssignedTo?: string
    excludeType?: string
    excludeRole?: string
}) => {
    const params = new URLSearchParams()
    projectId && params.append('project', projectId)
    status && params.append('status', status)
    severity && params.append('severity', severity)
    priority && params.append('priority', priority)
    owner && params.append('priority', owner)

    tags && params.append('tags', tags.toString())
    watchers && params.append('watchers', watchers)
    assignedTo && params.append('assigned_to', assignedTo)
    type && params.append('epic', type)
    role && params.append('role', role)
    statusIsClosed &&
        params.append('status__is_closed', statusIsClosed.toString())
    excludeStatus && params.append('exclude_status', excludeStatus)
    excludeTags && params.append('exclude_tags', excludeTags.toString())
    excludeAssignedTo && params.append('exclude_assigned_to', excludeAssignedTo)
    excludeRole && params.append('exclude_role', excludeRole)
    excludeSeverity && params.append('exclude_severity', excludeSeverity)
    excludePriority && params.append('exclude_priority', excludePriority)
    excludeType && params.append('exclude_type', excludeType)
    excludeOwner && params.append('exclude_owner', excludeOwner)

    return authInstance.get('/issues', { params })
}

export const createIssue = (data: any) => {
    return authInstance.post('/issues', data)
}

export const getIssue = (id: string) => {
    return authInstance.get(`/issues/${id}`)
}

export const replaceIssue = (id: string, data: any) => {
    return authInstance.put(`/issues/${id}/`)
}

export const updateIssue = (id: string, data: any) => {
    return authInstance.patch(`/issues/${id}/`)
}

export const deleteIssue = (id: string) => {
    return authInstance.delete(`/issues/${id}/`)
}

export const getFiltersData = (projectId: string) => {
    return authInstance.get(`/issues/filters_data?project=${projectId}`)
}

export const upvoteIssue = (id: string) => {
    return authInstance.post(`/issues/${id}/upvote`)
}

export const downvoteIssue = (id: string) => {
    return authInstance.post(`/issues/${id}/downvote`)
}

export const voters = (id: string) => {
    return authInstance.get(`/issues/${id}/voters`)
}

export const watchIssue = (id: string) => {
    return authInstance.post(`/issues/${id}/watch`)
}

export const unwatchIssue = (id: string) => {
    return authInstance.post(`/issues/${id}/unwatch`)
}

export const getIssueWatchers = (id: string) => {
    return authInstance.get(`/issues/${id}/watchers`)
}

export const getAttachments = () => {
    return authInstance.get(`/issues/attachments`)
}

export const createIssueAttachment = (data: any) => {
    return authInstance.post(`/issues/attachments`, data)
}

export const getIssueAttachments = (attachmentId: string) => {
    return authInstance.get(`/issues/attachments/${attachmentId}`)
}

export const replaceIssueAttachment = (attachmentId: string, data: any) => {
    return authInstance.put(`/issues/attachments/${attachmentId}`, data)
}

export const updateIssueAttachment = (attachmentId: string, data: any) => {
    return authInstance.patch(`/issues/attachments/${attachmentId}`, data)
}

export const deleteIssueAttachment = (attachmentId: string) => {
    return authInstance.delete(`/issues/attachments/${attachmentId}`)
}
