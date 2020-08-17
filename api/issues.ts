import authInstance from "../util/axiosInstance"

export const getIssues = () => {
    return authInstance.get('/issues')
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
