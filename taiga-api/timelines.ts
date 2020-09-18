import authInstance from '../util/axiosInstance'

export interface Timeline {
    content_type: number,
    created: string,
    data: {
        comment: string,
        comment_html: string,
        milestone: {
            id: number,
            name: string,
            slug: string
        },
        project: {
            description: string,
            id: number,
            name: string,
            slug: string
        },
        user: {
            big_photo: null | string,
            date_joined: string,
            gravatar_id: string,
            id: number,
            is_profile_visible: true,
            name: string,
            photo: null | string,
            username: string
        },
        userstory: {
            id: number,
            ref: number,
            subject: string
        },
        values_diff: {
            attachments: {
                changed: [
                    {
                        changes: {
                            description: string[]
                        },
                        filename: string,
                        thumb_url: null | string,
                        url: string
                    }
                ],
                deleted: string[],
                new: string[]
            }
        }
    },
    data_content_type: number,
    event_type: string,
    id: number,
    namespace: string,
    object_id: number,
    project: number
}

export const getUserTimeline = (userId: string) => {
    return authInstance.get<Timeline[]>(`timeline/user/${userId}`).then(res => res.data)
}
export const getProfileTimeline = (userId: string) => {
    return authInstance.get<Timeline[]>(`/timeline/profile/${userId}`).then(res => res.data)
}
export const getProjectTimeline = (projectId: string) => {
    return authInstance.get<Timeline[]>(`/timeline/project/${projectId}`).then(res => res.data)
}

