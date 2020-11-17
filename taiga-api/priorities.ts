import { authInstance } from '../util/axiosInstance'

export const getPriorities = () => {
    return authInstance.get(`/priorities`)
}

export const createPriority = (data: any) => {
    return authInstance.post(`/priorities`, data)
}

export const getPriority = (id: string) => {
    return authInstance.get(`/priorities/${id}`)
}

export const replacePriority = (id: string, data: any) => {
    return authInstance.put(`/priorities/${id}`, data)
}

export const updatePriority = (id: string, data: any) => {
    return authInstance.patch(`/priorities/${id}`, data)
}

export const deletePriority = (id: string) => {
    return authInstance.delete(`/priorities/${id}`)
}
