import { authInstance, publicInstance } from '../util/axiosInstance'

export interface User {
    accepted_terms: boolean
    auth_token: string
    big_photo: string | null
    bio: string
    color: string
    date_joined: string
    email: string
    full_name: string
    full_name_display: string
    gravatar_id: string
    id: number
    is_active: boolean
    lang: string
    max_memberships_private_projects: number | null
    max_memberships_public_projects: number | null
    max_private_projects: number | null
    max_public_projects: number | null
    photo: string | null
    read_new_terms: boolean
    roles: string[]
    theme: string
    timezone: string
    total_private_projects: number
    total_public_projects: number
    username: string
    uuid: string
}

export const getUsers = () => {
    return authInstance.get<User[]>(`/users`).then((res) => res.data)
}

export const getPublicUser = (id: string) => {
    return publicInstance.get<User>(`/users/${id}`).then((res) => res.data)
}

export const getUser = (id: string) => {
    return authInstance.get<User>(`/users/${id}`).then((res) => res.data)
}
export const getMe = () => {
    return authInstance.get<User>(`/users/me`).then((res) => res.data)
}
export const replaceUser = (id: number, data: any) => {
    return authInstance.put<User>(`/users/${id}`, data).then((res) => res.data)
}
export const updateUser = (id: number, data: any) => {
    return authInstance
        .patch<User>(`/users/${id}`, data)
        .then((res) => res.data)
}

export const getUserStats = (id: number) => {
    return authInstance.get(`/users/${id}/stats`).then((res) => res.data)
}

export const getUserWatched = (id: number) => {
    return authInstance.get(`/users/${id}/watched`).then((res) => res.data)
}

export const getUserLiked = (id: number) => {
    return authInstance.get(`/users/${id}/liked`).then((res) => res.data)
}

export const getUserVoted = (id: number) => {
    return authInstance.get(`/users/${id}/voted`).then((res) => res.data)
}

export const deleteUser = (id: number) => {
    return authInstance.delete(`/users/${id}`).then((res) => res.data)
}

export const getUserContacts = (id: number) => {
    return authInstance.get(`/users/${id}/contacts`).then((res) => res.data)
}

export const changeAvatar = (data: any) => {
    return authInstance
        .post<User>(`/users/change_avatar`, data)
        .then((res) => res.data)
}

export const removeAvatar = () => {
    return authInstance
        .post<User>(`/users/remove_avatar`)
        .then((res) => res.data)
}
export const changeEmail = () => {
    return authInstance.post(`/users/change_email`).then((res) => res.data)
}
export const changePassword = (current_password: string, password: string) => {
    return authInstance
        .post(`/users/change_password`, { current_password, password })
        .then((res) => res.data)
}
export const passwordRecovery = () => {
    return authInstance.post(`/users/password_recovery`).then((res) => res.data)
}
export const changePasswordFromRecovery = () => {
    return authInstance
        .post(`/users/change_password_from_recovery`)
        .then((res) => res.data)
}
