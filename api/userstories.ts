import authInstance from '../util/axiosInstance'

export const getUserstories = () => {
    authInstance.get('/userstories')
}

export const createUserstory = (data: any) => {
    authInstance.post('/userstories', data)
}

export const getUserstory = (id: string) => {
    authInstance.get(`/userstories/${id}`)
}

export const replaceUserstory = (id: string, data: any) => {
    authInstance.put(`/userstories/${id}/`)
}

export const updateUserstory = (id: string, data: any) => {
    authInstance.patch(`/userstories/${id}/`)
}

export const deleteUserstory = (id: string) => {
    authInstance.delete(`/userstories/${id}/`)
}

export const getFiltersData = (projectId: string) => {
    authInstance.get(`/userstories/filters_data?project=${projectId}`)
}

export const upvoteUserstory = (id: string) => {
    authInstance.post(`/userstories/${id}/upvote`)
}

export const downvoteUserstory = (id: string) => {
    authInstance.post(`/userstories/${id}/downvote`)
}

export const voters = (id: string) => {
    authInstance.get(`/userstories/${id}/voters`)
}

export const watchUserstory = (id: string) => {
    authInstance.post(`/userstories/${id}/watch`)
}

export const unwatchUserstory = (id: string) => {
    authInstance.post(`/userstories/${id}/unwatch`)
}

export const getUserstoryWatchers = (id: string) => {
    authInstance.get(`/userstories/${id}/watchers`)
}

export const getAttachments = () => {
    authInstance.get(`/userstories/attachments`)
}

export const createUserstoryAttachment = (data: any) => {
    authInstance.post(`/userstories/attachments`, data)
}

export const getUserstoryAttachments = (attachmentId: string) => {
    authInstance.get(`/userstories/attachments/${attachmentId}`)
}

export const replaceUserstoryAttachment = (attachmentId: string, data: any) => {
    authInstance.put(`/userstories/attachments/${attachmentId}`, data)
}

export const updateUserstoryAttachment = (attachmentId: string, data: any) => {
    authInstance.patch(`/userstories/attachments/${attachmentId}`, data)
}

export const deleteUserstoryAttachment = (attachmentId: string) => {
    authInstance.delete(`/userstories/attachments/${attachmentId}`)
}
