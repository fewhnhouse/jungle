import { Timeline } from '../taiga-api/timelines'
import moment from 'moment'

export const recentTaskFilter = (timeline: Timeline[]) => {
    const today = moment()
    return (
        timeline
            ?.filter((t) => {
                return today.diff(moment(t.created), 'days') < 1
            })
            ?.filter(
                (t) =>
                    t.event_type.includes('task') ||
                    t.event_type.includes('userstory')
            )
            ?.reduce((prev, curr) => {
                if (curr.event_type.includes('task')) {
                    if (
                        prev.find(
                            (el) => el.data.task?.id === curr.data.task.id
                        )
                    ) {
                        return prev
                    } else {
                        return [...prev, curr]
                    }
                } else if (curr.event_type.includes('userstory')) {
                    if (
                        prev.find(
                            (el) =>
                                el.data.userstory?.id === curr.data.userstory.id
                        )
                    ) {
                        return prev
                    } else {
                        return [...prev, curr]
                    }
                }
            }, [])
            ?.filter((_, index) => index < 10) ?? []
    )
}
