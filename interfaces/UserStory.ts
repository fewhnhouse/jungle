import { IUser } from './User'

export interface Task {
    id: number
    ref: number
    subject: string
    status_id: number
}

export interface IUserStory {
    assigned_to: null
    assigned_to_extra_info: null
    assigned_users: []
    attachments: []
    backlog_order: number
    blocked_note: string
    client_requirement: boolean
    comment: string
    created_date: string
    due_date: null
    due_date_reason: string
    due_date_status: string
    epic_order: null
    epics: null
    external_reference: null
    finish_date: null
    generated_from_issue: null
    generated_from_task: null
    id: number
    is_blocked: boolean
    is_closed: boolean
    is_voter: boolean
    is_watcher: boolean
    kanban_order: number
    milestone: null
    milestone_name: null
    milestone_slug: null
    modified_date: string
    origin_issue: null
    origin_task: null
    owner: number
    owner_extra_info: IUser
    points: any
    project: number
    project_extra_info: {
        name: string
        slug: string
        logo_small_url: null
        id: 1
    }
    ref: number
    sprint_order: number
    status: number
    status_extra_info: { name: string; color: string; is_closed: boolean }
    subject: string
    tags: []
    tasks: Task[]
    team_requirement: boolean
    total_attachments: number
    total_comments: number
    total_points: null
    total_voters: number
    total_watchers: number
    tribe_gig: null
    version: number
    watchers: number[]
}

export interface Status {
    id: number
    name: string
    color: string
    is_closed: boolean
}