import authInstance from '../util/axiosInstance'

export const getMilestones = () => {
    return authInstance.get('/milestones')
}

export const createMilestone = (data: any) => {
    return authInstance.post('/milestones', data)
}

export const getMilestone = (id: string) => {
    return authInstance.get(`/milestones/${id}`)
}

export const replaceMilestone = (id: string, data: any) => {
    return authInstance.put(`/milestones/${id}/`)
}

export const updateMilestone = (id: string, data: any) => {
    return authInstance.patch(`/milestones/${id}/`)
}

export const deleteMilestone = (id: string) => {
    return authInstance.delete(`/milestones/${id}/`)
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
