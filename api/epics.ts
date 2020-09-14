import authInstance from '../util/axiosInstance'

export const getEpics = ({
    projectId,
    slug,
    assignedTo,
    isClosed,
}: {
    projectId?: number
    slug?: string
    assignedTo?: string
    isClosed?: boolean
}) => {
    const params = new URLSearchParams()
    projectId && params.append('project', projectId.toString())
    slug && params.append('project__slug', slug)
    assignedTo && params.append('assigned_to', assignedTo)
    isClosed && params.append('status__is_closed', isClosed.toString())

    return authInstance.get('/epics', { params }).then(res => res.data)
}

export const createEpic = (data: any) => {
    return authInstance.post('/epics', data).then(res => res.data)
}

export const getEpic = (id: number) => {
    return authInstance.get(`/epics/${id}`).then(res => res.data)
}

export const replaceEpic = (id: number, data: any) => {
    return authInstance.put(`/epics/${id}/`).then(res => res.data)
}

export const updateEpic = (id: number, data: any) => {
    return authInstance.patch(`/epics/${id}/`).then(res => res.data)
}

export const deleteEpic = (id: number) => {
    return authInstance.delete(`/epics/${id}/`).then(res => res.data)
}

export const getEpicRelatedUserstories = (id: number) => {
    return authInstance.get(`/epics/${id}/related_userstories`).then(res => res.data)
}

export const createEpicRelatedUserstories = (id: number, data: any) => {
    return authInstance.post(`/epics/${id}/related_userstories`, data).then(res => res.data)
}

export const getEpicRelatedUserstory = (id: number, userstoryId: number) => {
    return authInstance.get(`/epics/${id}/related_userstories/${userstoryId}`).then(res => res.data)
}

export const replaceEpicRelatedUserstory = (
    id: number,
    userstoryId: number,
    data: any
) => {
    return authInstance.put(
        `/epics/${id}/related_userstories/${userstoryId}`,
        data
    ).then(res => res.data)
}

export const updateEpicRelatedUserstory = (
    id: number,
    userstoryId: number,
    data: any
) => {
    return authInstance.patch(
        `/epics/${id}/related_userstories/${userstoryId}`,
        data
    ).then(res => res.data)
}

export const deleteEpicRelatedUserstory = (id: number, userstoryId: number) => {
    return authInstance.delete(
        `/epics/${id}/related_userstories/${userstoryId}`
    ).then(res => res.data)
}

export const getFiltersData = (projectId: number) => {
    return authInstance.get(`/epics/filters_data?project=${projectId}`).then(res => res.data)
}

export const upvoteEpic = (id: number) => {
    return authInstance.post(`/epics/${id}/upvote`).then(res => res.data)
}

export const downvoteEpic = (id: number) => {
    return authInstance.post(`/epics/${id}/downvote`).then(res => res.data)
}

export const voters = (id: number) => {
    return authInstance.get(`/epics/${id}/voters`).then(res => res.data)
}

export const watchEpic = (id: number) => {
    return authInstance.post(`/epics/${id}/watch`).then(res => res.data)
}

export const unwatchEpic = (id: number) => {
    return authInstance.post(`/epics/${id}/unwatch`).then(res => res.data)
}

export const getEpicWatchers = (id: number) => {
    return authInstance.get(`/epics/${id}/watchers`).then(res => res.data)
}

export const getAttachments = ({
    projectId,
    epicId,
}: {
    projectId?: number
    epicId?: number
}) => {
    const params = new URLSearchParams()
    projectId && params.append('project', projectId.toString())
    epicId && params.append('object_id', epicId.toString())

    return authInstance.get(`/epics/attachments`, { params }).then(res => res.data)
}

export const createEpicAttachment = (data: any) => {
    return authInstance.post(`/epics/attachments`, data).then(res => res.data)
}

export const getEpicAttachments = (attachmentId: number) => {
    return authInstance.get(`/epics/attachments/${attachmentId}`).then(res => res.data)
}

export const replaceEpicAttachment = (attachmentId: number, data: any) => {
    return authInstance.put(`/epics/attachments/${attachmentId}`, data).then(res => res.data)
}

export const updateEpicAttachment = (attachmentId: number, data: any) => {
    return authInstance.patch(`/epics/attachments/${attachmentId}`, data).then(res => res.data)
}

export const deleteEpicAttachment = (attachmentId: number) => {
    return authInstance.delete(`/epics/attachments/${attachmentId}`).then(res => res.data)
}
