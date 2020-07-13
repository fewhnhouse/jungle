interface Author {
    id: string
    name: string
    url: string
    avatarUrl: string
    colors: {
        soft: string
        hard: string
    }
}

export interface Issue {
    id: string
    content: string
    status: string
    tags: string[]
    priority: number
    type: string
    storyPoints: number
    author: Author
    sprint?: {
        id: string
    }
}
