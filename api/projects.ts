import authInstance from '../util/axiosInstance'

export const getProjects = () => {
    authInstance.get(`/projects`)
}

export const getProject = (id: string) => {
    authInstance.get(`/projects/${id}`)
}

export const addProject = () => {
    authInstance.post(`/projects/`)
}

export const replaceProject = (id: string, data: any) => {
    authInstance.put(`/projects/${id}`, data)
}

export const updateProject = (id: string, data: any) => {
    authInstance.patch(`/projects/${id}`, data)
}

export const deleteProject = (id: string) => {
    authInstance.delete(`/projects/${id}`)
}

export const getProjectStats = (id: string) => {
    authInstance.get(`/projects/${id}/stats`)
}

export const getIssuesStats = (id: string) => {
    authInstance.get(`/projects/${id}/issues_stats`)
}

export const getTagColors = (id: string) => {
    authInstance.get(`/projects/${id}/tags_colors`)
}

export const createTag = (id: string, data: any) => {
    authInstance.get(`/projects/${id}/create_tag`, data)
}

export const editTag = (id: string, data: any) => {
    authInstance.post(`/projects/${id}/edit_tag`, data)
}

export const deleteTag = (id: string, data) => {
    authInstance.post(`/projects/${id}/delete_tag`, data)
}

export const mixTags = (id: string, data) => {
    authInstance.post(`/projects/${id}/mix_tags`, data)
}

export const like = (id: string) => {
    authInstance.post(`/projects/${id}/like`)
}

export const unlike = (id: string) => {
    authInstance.post(`/projects/${id}/unlike`)
}

export const fans = (id: string) => {
    authInstance.get(`/projects/${id}/fans`)
}

export const watchers = (id: string) => {
    authInstance.get(`/projects/${id}/watchers`)
}

export const watch = (id: string) => {
    authInstance.post(`/projects/${id}/watch`)
}

export const unwatch = (id: string) => {
    authInstance.post(`/projects/${id}/undwatch`)
}

export const createTemplate = (id: string) => {
    authInstance.post(`/projects/${id}/create_template`)
}

export const leaveProject = (id: string) => {
    authInstance.post(`/projects/${id}/leave`)
}

export const changeLogo = (id: string, data: any) => {
    authInstance.post(`/projects/${id}/change_logo`, data)
}

export const removeLogo = (id: string) => {
    authInstance.post(`/projects/${id}/remove_logo`)
}
