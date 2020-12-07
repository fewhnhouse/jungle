import { authInstance } from '../util/axiosInstance'

export interface Tag {
    name: string
    color: string
}

export const getTags = async (projectId: string) => {
    return authInstance
        .get<Tag[]>(`projects/${projectId}/tags_colors`)
        .then(({ data }) =>
            Object.keys(data).map((key) => ({ name: key, color: data[key] }))
        )
}

export const createTag = (
    projectId: string,
    data: { color: string | null; tag: string }
) => {
    return authInstance
        .post(`projects/${projectId}/create_tag`, data)
        .then((res) => res.data)
}

export const updateTag = (
    projectId: string,
    data: { color?: string; from_tag: string; to_tag?: string }
) => {
    return authInstance
        .post(`projects/${projectId}/edit_tag`, data)
        .then((res) => res.data)
}

export const deleteTag = (projectId: string, tag: string) => {
    return authInstance
        .post(`projects/${projectId}/delete_tag`, { tag })
        .then((res) => res.data)
}
