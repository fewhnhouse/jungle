export interface IUser {
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
