import { authInstance } from '../util/axiosInstance'

export const getSeverities = () => {
    return authInstance.get(`/severities`)
}

export const createSeverity = (data: any) => {
    return authInstance.post(`/severities`, data)
}

export const getSeverity = (id: string) => {
    return authInstance.get(`/severities/${id}`)
}

export const replaceSeverity = (id: string, data: any) => {
    return authInstance.put(`/severities/${id}`, data)
}

export const updateSeverity = (id: string, data: any) => {
    return authInstance.patch(`/severities/${id}`, data)
}

export const deleteSeverity = (id: string) => {
    return authInstance.delete(`/severities/${id}`)
}
