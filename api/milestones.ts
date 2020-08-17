import authInstance from '../util/axiosInstance'

export const getMilestones = () => {
    authInstance.get('/milestones')
}

export const createMilestone = (data: any) => {
    authInstance.post('/milestones', data)
}

export const getMilestone = (id: string) => {
    authInstance.get(`/milestones/${id}`)
}

export const replaceMilestone = (id: string, data: any) => {
    authInstance.put(`/milestones/${id}/`)
}

export const updateMilestone = (id: string, data: any) => {
    authInstance.patch(`/milestones/${id}/`)
}

export const deleteMilestone = (id: string) => {
    authInstance.delete(`/milestones/${id}/`)
}

export const getMilestoneStats = (id: string) => {
    authInstance.get(`/milestones/${id}/stats`)
}

export const watchMilestone = (id: string) => {
    authInstance.post(`/milestones/${id}/watch`)
}

export const unwatchMilestone = (id: string) => {
    authInstance.post(`/milestones/${id}/unwatch`)
}

export const getMilestoneWatchers = (id: string) => {
    authInstance.get(`/milestones/${id}/watchers`)
}
