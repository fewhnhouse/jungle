import { authInstance } from '../util/axiosInstance'

export interface Membership {
    color: string
    created_at: string
    email: string
    full_name: string
    gravatar_id: string
    id: number
    invitation_extra_text: null | string
    invited_by: null | number
    is_admin: boolean
    is_owner: boolean
    is_user_active: boolean
    photo: null | string
    project: number
    project_name: string
    project_slug: string
    role: number
    role_name: string
    user: number
    user_email: string
    user_order: number
}

export const getMemberships = (projectId: string, page = 1) => {
    return authInstance
        .get<Membership[]>(`/memberships?project=${projectId}&page=${page}`)
        .then((res) => res.data)
}

export const createMembership = (data: any) => {
    return authInstance
        .post<Membership>(`/memberships`, data)
        .then((res) => res.data)
}

export const getMembership = (id: string) => {
    return authInstance
        .get<Membership>(`/memberships/${id}`)
        .then((res) => res.data)
}

export const replaceMembership = (id: string, data: any) => {
    return authInstance
        .put<Membership>(`/memberships/${id}`, data)
        .then((res) => res.data)
}

export const updateMembership = (id: string, data: any) => {
    return authInstance
        .patch<Membership>(`/memberships/${id}`, data)
        .then((res) => res.data)
}

export const deleteMembership = (id: number) => {
    return authInstance.delete(`/memberships/${id}`).then((res) => res.data)
}

export const resendMembershipInvitation = (id: string) => {
    return authInstance
        .post(`/memberships/${id}/resend_invitation`)
        .then((res) => res.data)
}

export const getInvitationByAnonymousUser = (uuid: string) => {
    return authInstance.post(`/invitations/${uuid}`).then((res) => res.data)
}
