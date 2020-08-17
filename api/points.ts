import authInstance from '../util/axiosInstance'

export const getPoints = ({ projectId }: { projectId?: string }) => {
    const params = new URLSearchParams()
    projectId && params.append('project', projectId)
    return authInstance.get(`/points`, { params })
}

export const createPoint = (data: any) => {
    return authInstance.post(`/points`, data)
}

export const getPoint = (id: string) => {
    return authInstance.get(`/points/${id}`)
}

export const replacePoint = (id: string, data: any) => {
    return authInstance.put(`/points/${id}`, data)
}

export const updatePoint = (id: string, data: any) => {
    return authInstance.patch(`/points/${id}`, data)
}

export const deletePoint = (id: string) => {
    return authInstance.delete(`/points/${id}`)
}
