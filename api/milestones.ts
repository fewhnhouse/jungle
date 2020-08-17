import authInstance from '../util/axiosInstance'
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

export const getMilestones = ({
    projectId,
    closed,
}: {
    projectId?: string
    closed?: boolean
}) => {
    const params = new URLSearchParams()
    projectId && params.append('project', projectId)
    closed && params.append('closed', closed.toString())
    return authInstance
        .get<Milestone[]>(`/milestones`, { params })
        .then((res) => res.data)
}

export const createMilestone = (data: any) => {
    return authInstance
        .post<Milestone>('/milestones', data)
        .then((res) => res.data)
}

export const getMilestone = (id: string) => {
    return authInstance
        .get<Milestone>(`/milestones/${id}`)
        .then((res) => res.data)
}

export const replaceMilestone = (id: string, data: any) => {
    return authInstance
        .put<Milestone>(`/milestones/${id}`)
        .then((res) => res.data)
}

export const updateMilestone = (id: string, data: any) => {
    return authInstance.patch(`/milestones/${id}`)
}

export const deleteMilestone = (id: string) => {
    return authInstance.delete(`/milestones/${id}`)
}

export const getMilestoneStats = (id: string) => {
    return authInstance.get(`/milestones/${id}/stats`)
}

export const watchMilestone = (id: string) => {
    return authInstance.post(`/milestones/${id}/watch`)
}

export const unwatchMilestone = (id: string) => {
    return authInstance.post(`/milestones/${id}/unwatch`)
}

export const getMilestoneWatchers = (id: string) => {
    return authInstance.get(`/milestones/${id}/watchers`)
}
