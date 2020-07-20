import { IUser } from './User'

export interface IProject {
    anon_permissions: string[]
    blocked_code: number | null
    created_date: string
    creation_template: number
    default_epic_status: number
    default_issue_status: number
    default_issue_type: number
    default_points: number
    default_priority: number
    default_severity: number
    default_task_status: number
    default_us_status: number
    description: string
    i_am_admin: boolean
    i_am_member: boolean
    i_am_owner: boolean
    id: 1
    is_backlog_activated: boolean
    is_contact_activated: boolean
    is_epics_activated: boolean
    is_fan: boolean
    is_featured: boolean
    is_issues_activated: boolean
    is_kanban_activated: boolean
    is_looking_for_people: boolean
    is_private: boolean
    is_watcher: boolean
    is_wiki_activated: boolean
    logo_big_url: string | null
    logo_small_url: string | null
    looking_for_people_note: ''
    members: number[]
    modified_date: string
    my_homepage: string
    my_permissions: string[]
    name: string
    notify_level: number | null
    owner: IUser
    public_permissions: string[]
    slug: string
    tags: string[]
    tags_colors: any
    total_activity: number
    total_activity_last_month: number
    total_activity_last_week: number
    total_activity_last_year: number
    total_closed_milestones: number
    total_fans: number
    total_fans_last_month: number
    total_fans_last_week: number
    total_fans_last_year: number
    total_milestones: null | number
    total_story_points: null | number
    total_watchers: number
    totals_updated_datetime: string
    videoconferences: null | any
    videoconferences_extra_data: null | any
}
