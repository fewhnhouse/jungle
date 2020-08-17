import authInstance from '../util/axiosInstance'

export const getProjects = () => {
    return authInstance.get(`/projects`)
}

export const getProject = (id: string) => {
    return authInstance.get(`/projects/${id}`)
}

export const addProject = () => {
    return authInstance.post(`/projects/`)
}

export const replaceProject = (id: string, data: any) => {
    return authInstance.put(`/projects/${id}`, data)
}

export const updateProject = (id: string, data: any) => {
    return authInstance.patch(`/projects/${id}`, data)
}

export const deleteProject = (id: string) => {
    return authInstance.delete(`/projects/${id}`)
}

export const getProjectStats = (id: string) => {
    return authInstance.get(`/projects/${id}/stats`)
}

export const getIssuesStats = (id: string) => {
    return authInstance.get(`/projects/${id}/issues_stats`)
}

export const getTagColors = (id: string) => {
    return authInstance.get(`/projects/${id}/tags_colors`)
}

export const createTag = (id: string, data: any) => {
    return authInstance.get(`/projects/${id}/create_tag`, data)
}

export const editTag = (id: string, data: any) => {
    return authInstance.post(`/projects/${id}/edit_tag`, data)
}

export const deleteTag = (id: string, data) => {
    return authInstance.post(`/projects/${id}/delete_tag`, data)
}

export const mixTags = (id: string, data) => {
    return authInstance.post(`/projects/${id}/mix_tags`, data)
}

export const like = (id: string) => {
    return authInstance.post(`/projects/${id}/like`)
}

export const unlike = (id: string) => {
    return authInstance.post(`/projects/${id}/unlike`)
}

export const fans = (id: string) => {
    return authInstance.get(`/projects/${id}/fans`)
}

export const watchers = (id: string) => {
    return authInstance.get(`/projects/${id}/watchers`)
}

export const watch = (id: string) => {
    return authInstance.post(`/projects/${id}/watch`)
}

export const unwatch = (id: string) => {
    return authInstance.post(`/projects/${id}/undwatch`)
}

export const createTemplate = (id: string) => {
    return authInstance.post(`/projects/${id}/create_template`)
}

export const leaveProject = (id: string) => {
    return authInstance.post(`/projects/${id}/leave`)
}

export const changeLogo = (id: string, data: any) => {
    return authInstance.post(`/projects/${id}/change_logo`, data)
}

export const removeLogo = (id: string) => {
    return authInstance.post(`/projects/${id}/remove_logo`)
}
