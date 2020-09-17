import { DraggableLocation } from 'react-beautiful-dnd'
import { Issue } from '../interfaces/Issue'
import { Task, updateTask } from '../taiga-api/tasks'
import { UserStory } from '../taiga-api/userstories'

// a little function to help us with reordering the result
const reorder = (list: any[], startIndex: number, endIndex: number): any[] => {
    const result = Array.from(list)
    const [removed] = result.splice(startIndex, 1)
    result.splice(endIndex, 0, removed)
    console.log(list, result)
    return result
}

export default reorder

export interface ReorderIssueMapResult {
    issueMap: Issue[]
}

export interface ReorderTaskMapArgs {
    tasks: Task[]
    source: DraggableLocation
    destination: DraggableLocation
}

export interface ReoderBacklogArgs {
    issues: UserStory[]
    source: DraggableLocation
    destination: DraggableLocation
}

export const reorderBacklog = ({
    issues,
    source,
    destination,
}: ReoderBacklogArgs): UserStory[] => {
    const current: UserStory[] = issues.filter((issue) =>
        source.droppableId === 'backlog'
            ? issue?.milestone === null
            : issue?.milestone?.toString() === source.droppableId
    )
    const next: UserStory[] = issues.filter((issue) =>
        destination.droppableId === 'backlog'
            ? issue?.milestone === null
            : issue?.milestone?.toString() === destination.droppableId
    )
    const target: UserStory = current[source.index]

    // moving to same list
    if (source.droppableId === destination.droppableId) {
        const reordered: UserStory[] = reorder(
            current,
            source.index,
            destination.index
        )
        const unaffected = issues.filter((issue) =>
            source.droppableId === 'backlog'
                ? issue?.milestone !== null
                : issue?.milestone?.toString() !== source.droppableId
        )
        return [...unaffected, ...reordered]
    }

    // moving to different list

    // remove from original
    current.splice(source.index, 1)
    // insert into next
    next.splice(destination.index, 0, target)
    const unaffected = issues.filter(
        (issue) =>
            issue.id.toString() !== source.droppableId &&
            issue.id.toString() !== destination.droppableId
    )
    console.log(current, next, unaffected)

    return [...unaffected, ...current, ...next]
}

export const reorderTasks = ({
    tasks,
    source,
    destination
}) => {
    const task = tasks[source.index]
    console.log(tasks, source, destination)
    updateTask(task.id, { status: destination.droppableId })
}

/*
export const reorderBoard = ({
    issues,
    source,
    destination,
}: ReorderTaskMapArgs): Task[] => {
    console.log(issues, source, destination)
    const current = (issues as any[]).filter(
        (issue) =>
            (issue.status
                ? issue.status.toString()
                : issue.status_id.toString()) === source.droppableId
    )
    const next = (issues as any[]).filter(
        (issue) =>
            (issue.status
                ? issue.status.toString()
                : issue.status_id.toString()) === destination.droppableId
    )
    const target: Task = current[source.index]

    // moving to same list
    if (source.droppableId === destination.droppableId) {
        const reordered = reorder(current, source.index, destination.index)
        const unaffected = (issues as any[]).filter(
            (issue) =>
                (issue.status
                    ? issue.status.toString()
                    : issue.status_id.toString()) !== source.droppableId
        )
        return [...unaffected, ...reordered]
    }

    // moving to different list

    // remove from original
    current.splice(source.index, 1)
    // insert into next
    next.splice(destination.index, 0, {
        ...target,
        status_id: parseInt(destination.droppableId, 10),
    })
    const unaffected = (issues as any[]).filter(
        (issue) =>
            issue.status_id.toString() !== source.droppableId &&
            issue.status_id.toString() !== destination.droppableId
    )

    return [...unaffected, ...current, ...next]
}

type List<T> = {
    id: string
    values: T[]
}

type MoveBetweenArgs<T> = {
    list1: List<T>
    list2: List<T>
    source: DraggableLocation
    destination: DraggableLocation
}

type MoveBetweenResult<T> = {
    list1: List<T>
    list2: List<T>
}

export function moveBetween<T>({
    list1,
    list2,
    source,
    destination,
}: MoveBetweenArgs<T>): MoveBetweenResult<T> {
    const newFirst = Array.from(list1.values)
    const newSecond = Array.from(list2.values)

    const moveFrom = source.droppableId === list1.id ? newFirst : newSecond
    const moveTo = moveFrom === newFirst ? newSecond : newFirst

    const [moved] = moveFrom.splice(source.index, 1)
    moveTo.splice(destination.index, 0, moved)

    return {
        list1: {
            ...list1,
            values: newFirst,
        },
        list2: {
            ...list2,
            values: newSecond,
        },
    }
}
*/
