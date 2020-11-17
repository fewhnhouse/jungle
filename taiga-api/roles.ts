import { authInstance } from '../util/axiosInstance'

export const getRoles = ({ projectId }: { projectId?: string }) => {
    const params = new URLSearchParams()
    projectId && params.append('project', projectId)
    return authInstance.get(`/roles`, { params })
}

export const createRole = (data: any) => {
    return authInstance.post(`/roles`, data)
}

export const getRole = (id: string) => {
    return authInstance.get(`/roles/${id}`)
}

export const replaceRole = (id: string, data: any) => {
    return authInstance.put(`/roles/${id}`, data)
}

export const updateRole = (id: string, data: any) => {
    return authInstance.patch(`/roles/${id}`, data)
}

export const deleteRole = (id: string) => {
    return authInstance.delete(`/roles/${id}`)
}
