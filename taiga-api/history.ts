import authInstance from '../util/axiosInstance'

export const getUserstoryHistory = (id: string) => {
    return authInstance.get(`/history/userstory/${id}`)
}

export const getUserstoryCommentVersions = (id: string, commentId: string) => {
    return authInstance.get(
        `/history/userstory/${id}/commentVersions${commentId}`
    )
}

export const editUserstoryComment = (id: string, commentId: string) => {
    return authInstance.post(
        `/history/userstory/${id}/edit_comment?id=${commentId}`
    )
}

export const deleteUserstoryComment = (id: string, commentId: string) => {
    return authInstance.get(
        `/history/userstory/${id}/delete_comment?id=${commentId}`
    )
}

export const undeleteUserstoryComment = (id: string, commentId: string) => {
    return authInstance.get(
        `/history/userstory/${id}undelete_comment?id=${commentId}`
    )
}

export const getIssueHistory = (id: string) => {
    return authInstance.get(`/history/issue/${id}`)
}

export const getIssueCommentVersions = (id: string, commentId: string) => {
    return authInstance.get(`/history/issue/${id}/commentVersions${commentId}`)
}

export const editIssueComment = (id: string, commentId: string) => {
    return authInstance.post(
        `/history/issue/${id}/edit_comment?id=${commentId}`
    )
}

export const deleteIssueComment = (id: string, commentId: string) => {
    return authInstance.get(
        `/history/issue/${id}/delete_comment?id=${commentId}`
    )
}

export const undeleteIssueComment = (id: string, commentId: string) => {
    return authInstance.get(
        `/history/issue/${id}undelete_comment?id=${commentId}`
    )
}

export const getTaskHistory = (id: string) => {
    return authInstance.get(`/history/task/${id}`)
}

export const getTaskCommentVersions = (id: string, commentId: string) => {
    return authInstance.get(`/history/task/${id}/commentVersions${commentId}`)
}

export const editTaskComment = (id: string, commentId: string) => {
    return authInstance.post(
        `/history/task/${id}/edit_comment?id=${commentId}`
    )
}

export const deleteTaskComment = (id: string, commentId: string) => {
    return authInstance.get(
        `/history/task/${id}/delete_comment?id=${commentId}`
    )
}

export const undeleteTaskComment = (id: string, commentId: string) => {
    return authInstance.get(
        `/history/task/${id}undelete_comment?id=${commentId}`
    )
}

export const getWikiHistory = (id: string) => {
    return authInstance.get(`/history/wiki/${id}`)
}

export const getWikiCommentVersions = (id: string, commentId: string) => {
    return authInstance.get(`/history/wiki/${id}/commentVersions${commentId}`)
}

export const editWikiComment = (id: string, commentId: string) => {
    return authInstance.post(
        `/history/wiki/${id}/edit_comment?id=${commentId}`
    )
}

export const deleteWikiComment = (id: string, commentId: string) => {
    return authInstance.get(
        `/history/wiki/${id}/delete_comment?id=${commentId}`
    )
}

export const undeleteWikiComment = (id: string, commentId: string) => {
    return authInstance.get(
        `/history/wiki/${id}undelete_comment?id=${commentId}`
    )
}
