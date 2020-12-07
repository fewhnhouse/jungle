import { authInstance } from '../util/axiosInstance'

export interface StoryPoint {
    id: number
    name: string
    order: number
    project: number
    value: null | number
}

export const getPoints = async (projectId: string) => {
    const params = new URLSearchParams()
    projectId && params.append('project', projectId)
    return authInstance
        .get<StoryPoint[]>(`/points`, { params })
        .then((res) => res.data)
}

export const createPoint = (data: any) => {
    return authInstance
        .post<StoryPoint>(`/points`, data)
        .then((res) => res.data)
}

export const getPoint = (id: string) => {
    return authInstance.get<StoryPoint>(`/points/${id}`).then((res) => res.data)
}

export const replacePoint = (id: string, data: any) => {
    return authInstance
        .put<StoryPoint>(`/points/${id}`, data)
        .then((res) => res.data)
}

export const updatePoint = (id: string, data: any) => {
    return authInstance
        .patch<StoryPoint>(`/points/${id}`, data)
        .then((res) => res.data)
}

export const deletePoint = (id: number) => {
    return authInstance
        .delete<StoryPoint>(`/points/${id}`)
        .then((res) => res.data)
}
