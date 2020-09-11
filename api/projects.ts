import authInstance from '../util/axiosInstance'
import { User } from './users'

export interface Project {
    anon_permissions: string[]
    blocked_code: number | null
    created_date: string
    creation_template: number
    default_epic_status: number
    default_issue_status: number
    default_issue_type: number
    default_points: number
    default_priority: number
    default_severity: number
    default_task_status: number
    default_us_status: number
    description: string
    i_am_admin: boolean
    i_am_member: boolean
    i_am_owner: boolean
    id: 1
    is_backlog_activated: boolean
    is_contact_activated: boolean
    is_epics_activated: boolean
    is_fan: boolean
    is_featured: boolean
    is_issues_activated: boolean
    is_kanban_activated: boolean
    is_looking_for_people: boolean
    is_private: boolean
    is_watcher: boolean
    is_wiki_activated: boolean
    logo_big_url: string | null
    logo_small_url: string | null
    looking_for_people_note: ''
    members: number[]
    modified_date: string
    my_homepage: string
    my_permissions: string[]
    name: string
    notify_level: number | null
    owner: User
    public_permissions: string[]
    slug: string
    tags: string[]
    tags_colors: any
    total_activity: number
    total_activity_last_month: number
    total_activity_last_week: number
    total_activity_last_year: number
    total_closed_milestones: number
    total_fans: number
    total_fans_last_month: number
    total_fans_last_week: number
    total_fans_last_year: number
    total_milestones: null | number
    total_story_points: null | number
    total_watchers: number
    totals_updated_datetime: string
    videoconferences: null | any
    videoconferences_extra_data: null | any
}

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
