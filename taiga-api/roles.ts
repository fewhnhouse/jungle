import { authInstance } from '../util/axiosInstance'

export interface Role {
    computable: boolean
    id: number
    name: string
    order: number
    permissions: string[]
    project_id: number
    slug: string
}

export const getRoles = ({ projectId }: { projectId?: string }) => {
    const params = new URLSearchParams()
    projectId && params.append('project', projectId)
    return authInstance.get<Role[]>(`/roles`, { params }).then(res => res.data)
}

export const createRole = (data: any) => {
    return authInstance.post<Role>(`/roles`, data).then(res => res.data)
}

export const getRole = (id: string) => {
    return authInstance.get<Role>(`/roles/${id}`).then(res => res.data)
}

export const replaceRole = (id: string, data: any) => {
    return authInstance.put<Role>(`/roles/${id}`, data).then(res => res.data)
}

export const updateRole = (id: string, data: any) => {
    return authInstance.patch<Role>(`/roles/${id}`, data).then(res => res.data)
}

export const deleteRole = (id: string) => {
    return authInstance.delete(`/roles/${id}`).then(res => res.data)
}
