import CustomCollapse from '../Collapse'
import { useQueryCache } from 'react-query'
import { deleteMilestone, Milestone } from '../../taiga-api/milestones'
import IssueList from '../dnd/List'
import { Task } from '../../taiga-api/tasks'
import { useRouter } from 'next/router'
import Link from 'next/link'
import styled from 'styled-components'
import SprintCompletionModal from './SprintCompletionModal'
import { Skeleton } from 'antd'
import { useState } from 'react'
import EditSprint from './SprintEditModal'
import { UserStory } from '../../taiga-api/userstories'

const StyledLink = styled.a`
    color: rgba(0, 0, 0, 0.85);
    &:hover {
        color: rgba(0, 0, 0, 0.6);
    }
`

const Sprint = ({
    sprint,
    tasks,
    userstories,
    isLoading,
}: {
    sprint: Milestone
    tasks: Task[]
    userstories: UserStory[]
    isLoading: boolean
}) => {
    const { query, push } = useRouter()
    const queryCache = useQueryCache()

    const { projectId } = query
    const [editOpen, setEditOpen] = useState(false)
    const handleRemove = async () => {
        queryCache.setQueryData(
            ['milestones', { projectId }],
            (oldMilestones: Milestone[]) =>
                oldMilestones.filter((m) => m.id !== sprint.id)
        )
        queryCache.refetchQueries(['userstories', { projectId }])
        queryCache.refetchQueries(['tasks', { projectId }])
        await deleteMilestone(sprint.id)
    }

    const handleNavigation = () =>
        push(`/projects/${projectId}/board?sprint=${sprint.id}`)

    const handleEdit = () => setEditOpen(true)
    const handleEditClose = () => setEditOpen(false)

    const startDate = new Date(sprint.estimated_start)
    const endDate = new Date(sprint.estimated_finish)
    const today = new Date()

    const active = startDate <= today && today <= endDate
    const closed = sprint?.closed
    return (
        <Skeleton loading={isLoading} active>
            <CustomCollapse
                primaryAction={
                    active &&
                    !closed && (
                        <SprintCompletionModal milestoneId={sprint?.id} />
                    )
                }
                actions={[
                    { title: 'Remove Sprint', action: handleRemove },
                    { title: 'Edit Sprint', action: handleEdit },
                    {
                        title: 'Go to Sprint Taskboard',
                        action: handleNavigation,
                    },
                ]}
                key={sprint.id}
                title={
                    <Link
                        passHref
                        href={`/projects/${projectId}/board?sprint=${sprint.id}`}
                    >
                        <StyledLink>{sprint.name}</StyledLink>
                    </Link>
                }
                description={`${startDate.toLocaleDateString()}-${endDate.toLocaleDateString()}`}
                status={closed ? 'closed' : active ? 'active' : 'default'}
            >
                <IssueList
                    style={{ minHeight: 100 }}
                    listId={sprint.id.toString()}
                    issues={[
                        ...(userstories?.filter((story) => !story.is_closed) ??
                            []),
                        ...(tasks?.filter(
                            (task) =>
                                !task.is_closed && task.user_story === null
                        ) ?? []),
                    ]}
                />
            </CustomCollapse>
            <EditSprint
                onClose={handleEditClose}
                open={editOpen}
                sprint={sprint}
            />
        </Skeleton>
    )
}

export default Sprint
