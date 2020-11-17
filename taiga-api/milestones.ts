import { authInstance } from '../util/axiosInstance'
import { UserStory } from './userstories'

export interface Milestone {
    closed: boolean
    closed_points: null | number
    created_date: string
    disponibility: number
    estimated_finish: string
    estimated_start: string
    id: number
    modified_date: string
    name: string
    order: number
    owner: number
    project: number
    project_extra_info: {
        name: string
        slug: string
        logo_small_url: null | string
        id: number
    }
    slug: string
    total_points: null | number
    user_stories: UserStory[]
}

export const getMilestones = (urlParams?: {
    projectId?: string
    closed?: boolean
}) => {
    const params = new URLSearchParams()
    if (urlParams) {
        const { projectId, closed } = urlParams
        projectId && params.append('project', projectId)
        closed && params.append('closed', closed.toString())
    }
    return authInstance
        .get<Milestone[]>(`/milestones`, { params })
        .then((res) => res.data)
}

export const createMilestone = (data: any) => {
    return authInstance
        .post<Milestone>('/milestones', data)
        .then((res) => res.data)
}

export const getMilestone = (id: number) => {
    return authInstance
        .get<Milestone>(`/milestones/${id}`)
        .then((res) => res.data)
}

export const replaceMilestone = (id: number, data: any) => {
    return authInstance
        .put<Milestone>(`/milestones/${id}`)
        .then((res) => res.data)
}

export const updateMilestone = (id: number, data: any) => {
    return authInstance.patch(`/milestones/${id}`, data).then(res => res.data)
}

export const deleteMilestone = (id: number) => {
    return authInstance.delete(`/milestones/${id}`).then(res => res.data)
}

export const getMilestoneStats = (id: number) => {
    return authInstance.get(`/milestones/${id}/stats`).then(res => res.data)
}

export const watchMilestone = (id: number) => {
    return authInstance.post(`/milestones/${id}/watch`).then(res => res.data)
}

export const unwatchMilestone = (id: number) => {
    return authInstance.post(`/milestones/${id}/unwatch`).then(res => res.data)
}

export const getMilestoneWatchers = (id: number) => {
    return authInstance.get(`/milestones/${id}/watchers`).then(res => res.data)
}
