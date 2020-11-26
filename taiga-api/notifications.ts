import { authInstance } from '../util/axiosInstance'

interface NotificationReturnType {
    objects: Notification[]
    total: number
}

export interface NotifiedObject {
    id: number
    ref: number
    subject: string
    content_type: 'task' | 'userstory' | 'issue' | 'epic'
}

export interface NotifiedProject {
    id: number
    name: string
    slug: string
}

export interface NotifyingUser {
    big_photo: string | null
    date_joined: string
    gravatar_id: string
    id: number
    is_profile_visible: boolean
    name: string
    photo: string | null
    username: string
}

export interface Notification {
    created: string
    data: {
        obj?: NotifiedObject
        project: NotifiedProject
        user: NotifyingUser
    }
    event_type: number
    id: number
    read: null
    user: number
}

export const getNotifications = async (unread = true, page = 1) => {
    const params = new URLSearchParams()
    unread && params.append('only_unread', unread.toString())
    params.append('page', page.toString())

    return authInstance
        .get<NotificationReturnType>(`/web-notifications`, { params })
        .then((res) => res.data)
}

export const markAsRead = async () => {
    return authInstance.post(`/web-notifications/set-as-read`).then((res) => res.data)
}
