import authInstance from '../util/axiosInstance'

export const getMemberships = () => {
    return authInstance.get(`/memberships`)
}

export const createMembership = (data: any) => {
    return authInstance.post(`/memberships`, data)
}

export const getMembership = (id: string) => {
    return authInstance.get(`/memberships/${id}`)
}

export const replaceMembership = (id: string, data: any) => {
    return authInstance.put(`/memberships/${id}`, data)
}

export const updateMembership = (id: string, data: any) => {
    return authInstance.patch(`/memberships/${id}`, data)
}

export const deleteMembership = (id: string) => {
    return authInstance.delete(`/memberships/${id}`)
}

export const resendMembershipInvitation = (id: string) => {
    return authInstance.post(`/memberships/${id}/resend_invitation`)
}

export const getInvitationByAnonymousUser = (uuid: string) => {
    return authInstance.post(`/invitations/${uuid}`)
}
