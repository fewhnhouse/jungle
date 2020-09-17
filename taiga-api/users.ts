import authInstance from '../util/axiosInstance'

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
    return authInstance.get(`/users`)
}

export const getUser = (id: string) => {
    return authInstance.get(`/users/${id}`)
}
export const getMe = () => {
    return authInstance.get(`/users/me`)
}
export const replaceUser = (id: string) => {
    return authInstance.put(`/users/${id}`)
}
export const updateUser = (id: string) => {
    return authInstance.patch(`/users/${id}`)
}

export const getUserStats = (id: string) => {
    return authInstance.get(`/users/${id}/stats`)
}

export const getUserWatched = (id: string) => {
    return authInstance.get(`/users/${id}/watched`)
}

export const getUserLiked = (id: string) => {
    return authInstance.get(`/users/${id}/liked`)
}

export const getUserVoted = (id: string) => {
    return authInstance.get(`/users/${id}/voted`)
}

export const deleteUser = (id: string) => {
    return authInstance.delete(`/users/${id}`)
}

export const getUserContacts = (id: string) => {
    return authInstance.get(`/users/${id}/contacts`)
}

export const changeAvatar = () => {
    return authInstance.post(`/users/change_avatar`)
}

export const removeAvatar = () => {
    return authInstance.post(`/users/remove_avatar`)
}
export const changeEmail = () => {
    return authInstance.post(`/users/change_email`)
}
export const changePassword = () => {
    return authInstance.post(`/users/change_password`)
}
export const passwordRecovery = () => {
    return authInstance.post(`/users/password_recovery`)
}
export const changePasswordFromRecovery = () => {
    return authInstance.post(`/users/change_password_from_recovery`)
}
