import { authInstance } from '../util/axiosInstance'

export interface TaigaHistory {
    comment: string
    comment_html: string
    created_at: string
    delete_comment_date: null | string
    delete_comment_user: null | {
        name: string
        pk: number
    }
    diff: any
    edit_comment_date: null | string
    id: string
    is_hidden: boolean
    is_snapshot: boolean
    key: string
    snapshot: null
    type: number
    user: {
        gravatar_id: string
        is_active: boolean
        name: string
        photo: null | string
        pk: number
        username: string
    }
    values: {
        users: any
    }
    values_diff: any
}

export const getUserstoryHistory = (id: number, type: 'activity' | 'comment') => {
    return authInstance.get<TaigaHistory[]>(`/history/userstory/${id}?type=${type}`).then(res => res.data)
}

export const getUserstoryCommentVersions = (id: number, commentId: string) => {
    return authInstance.get(
        `/history/userstory/${id}/commentVersions${commentId}`
    )
}

export const editUserstoryComment = (id: number, commentId: string, comment: string) => {
    return authInstance.post(
        `/history/userstory/${id}/edit_comment?id=${commentId}`, { comment }
    )
}

export const deleteUserstoryComment = (id: number, commentId: string) => {
    return authInstance.post(
        `/history/userstory/${id}/delete_comment?id=${commentId}`
    )
}

export const undeleteUserstoryComment = (id: number, commentId: string) => {
    return authInstance.post(
        `/history/userstory/${id}/undelete_comment?id=${commentId}`
    )
}

export const getIssueHistory = (id: number) => {
    return authInstance.get<TaigaHistory[]>(`/history/issue/${id}`).then(res => res.data)
}

export const getIssueCommentVersions = (id: number, commentId: string) => {
    return authInstance.get(`/history/issue/${id}/commentVersions${commentId}`)
}

export const editIssueComment = (id: number, commentId: string, comment: string) => {
    return authInstance.post(
        `/history/issue/${id}/edit_comment?id=${commentId}`, { comment }
    )
}

export const deleteIssueComment = (id: number, commentId: string) => {
    return authInstance.post(
        `/history/issue/${id}/delete_comment?id=${commentId}`
    )
}

export const undeleteIssueComment = (id: number, commentId: string) => {
    return authInstance.post(
        `/history/issue/${id}/undelete_comment?id=${commentId}`
    )
}

export const getTaskHistory = (id: number, type: 'activity' | 'comment') => {
    return authInstance.get<TaigaHistory[]>(`/history/task/${id}?type=${type}`).then(res => res.data)
}

export const getTaskCommentVersions = (id: number, commentId: string) => {
    return authInstance.get(`/history/task/${id}/commentVersions${commentId}`)
}

export const editTaskComment = (id: number, commentId: string, comment: string) => {
    return authInstance.post(
        `/history/task/${id}/edit_comment?id=${commentId}`, { comment }
    )
}

export const deleteTaskComment = (id: number, commentId: string) => {
    return authInstance.post(
        `/history/task/${id}/delete_comment?id=${commentId}`
    )
}

export const undeleteTaskComment = (id: number, commentId: string) => {
    return authInstance.post(
        `/history/task/${id}/undelete_comment?id=${commentId}`
    )
}

export const getWikiHistory = (id: number) => {
    return authInstance.get(`/history/wiki/${id}`)
}

export const getWikiCommentVersions = (id: number, commentId: string) => {
    return authInstance.get(`/history/wiki/${id}/commentVersions${commentId}`)
}

export const editWikiComment = (id: number, commentId: string, comment: string) => {
    return authInstance.post(
        `/history/wiki/${id}/edit_comment?id=${commentId}`, { comment }
    )
}

export const deleteWikiComment = (id: number, commentId: string) => {
    return authInstance.post(
        `/history/wiki/${id}/delete_comment?id=${commentId}`
    )
}

export const undeleteWikiComment = (id: number, commentId: string) => {
    return authInstance.post(
        `/history/wiki/${id}/undelete_comment?id=${commentId}`
    )
}
