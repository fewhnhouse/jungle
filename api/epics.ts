import authInstance from '../util/axiosInstance'

export const getEpics = ({
    projectId,
    slug,
    assignedTo,
    isClosed,
}: {
    projectId?: string
    slug?: string
    assignedTo?: string
    isClosed?: boolean
}) => {
    const params = new URLSearchParams()
    projectId && params.append('project', projectId)
    slug && params.append('project__slug', slug)
    assignedTo && params.append('assigned_to', assignedTo)
    isClosed && params.append('status__is_closed', isClosed.toString())

    return authInstance.get('/epics', { params })
}

export const createEpic = (data: any) => {
    return authInstance.post('/epics', data)
}

export const getEpic = (id: string) => {
    return authInstance.get(`/epics/${id}`)
}

export const replaceEpic = (id: string, data: any) => {
    return authInstance.put(`/epics/${id}/`)
}

export const updateEpic = (id: string, data: any) => {
    return authInstance.patch(`/epics/${id}/`)
}

export const deleteEpic = (id: string) => {
    return authInstance.delete(`/epics/${id}/`)
}

export const getEpicRelatedUserstories = (id: string) => {
    return authInstance.get(`/epics/${id}/related_userstories`)
}

export const createEpicRelatedUserstories = (id: string, data: any) => {
    return authInstance.post(`/epics/${id}/related_userstories`, data)
}

export const getEpicRelatedUserstory = (id: string, userstoryId: string) => {
    return authInstance.get(`/epics/${id}/related_userstories/${userstoryId}`)
}

export const replaceEpicRelatedUserstory = (
    id: string,
    userstoryId: string,
    data: any
) => {
    return authInstance.put(
        `/epics/${id}/related_userstories/${userstoryId}`,
        data
    )
}

export const updateEpicRelatedUserstory = (
    id: string,
    userstoryId: string,
    data: any
) => {
    return authInstance.patch(
        `/epics/${id}/related_userstories/${userstoryId}`,
        data
    )
}

export const deleteEpicRelatedUserstory = (id: string, userstoryId: string) => {
    return authInstance.delete(
        `/epics/${id}/related_userstories/${userstoryId}`
    )
}

export const getFiltersData = (projectId: string) => {
    return authInstance.get(`/epics/filters_data?project=${projectId}`)
}

export const upvoteEpic = (id: string) => {
    return authInstance.post(`/epics/${id}/upvote`)
}

export const downvoteEpic = (id: string) => {
    return authInstance.post(`/epics/${id}/downvote`)
}

export const voters = (id: string) => {
    return authInstance.get(`/epics/${id}/voters`)
}

export const watchEpic = (id: string) => {
    return authInstance.post(`/epics/${id}/watch`)
}

export const unwatchEpic = (id: string) => {
    return authInstance.post(`/epics/${id}/unwatch`)
}

export const getEpicWatchers = (id: string) => {
    return authInstance.get(`/epics/${id}/watchers`)
}

export const getAttachments = ({
    projectId,
    epicId,
}: {
    projectId?: string
    epicId?: string
}) => {
    const params = new URLSearchParams()
    projectId && params.append('project', projectId)
    epicId && params.append('object_id', epicId)

    return authInstance.get(`/epics/attachments`, { params })
}

export const createEpicAttachment = (data: any) => {
    return authInstance.post(`/epics/attachments`, data)
}

export const getEpicAttachments = (attachmentId: string) => {
    return authInstance.get(`/epics/attachments/${attachmentId}`)
}

export const replaceEpicAttachment = (attachmentId: string, data: any) => {
    return authInstance.put(`/epics/attachments/${attachmentId}`, data)
}

export const updateEpicAttachment = (attachmentId: string, data: any) => {
    return authInstance.patch(`/epics/attachments/${attachmentId}`, data)
}

export const deleteEpicAttachment = (attachmentId: string) => {
    return authInstance.delete(`/epics/attachments/${attachmentId}`)
}
