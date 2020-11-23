import CustomCollapse from '../Collapse'
import { queryCache, useQuery } from 'react-query'
import { deleteMilestone, Milestone } from '../../taiga-api/milestones'
import IssueList from '../dnd/List'
import { getTasks } from '../../taiga-api/tasks'
import { useRouter } from 'next/router'
import Link from 'next/link'
import styled from 'styled-components'
import SprintCompletionModal from './SprintCompletionModal'
import { Skeleton } from 'antd'

const StyledLink = styled.a`
    color: rgba(0, 0, 0, 0.85);
    &:hover {
        color: rgba(0, 0, 0, 0.6);
    }
`

const Sprint = ({ sprint }: { sprint: Milestone }) => {
    const { query, push } = useRouter()
    const { projectId } = query
    const handleRemove = async () => {
        queryCache.setQueryData(
            ['milestones', { projectId }],
            (oldMilestones: Milestone[]) =>
                oldMilestones.filter((m) => m.id !== sprint.id)
        )
        await deleteMilestone(sprint.id)
    }

    const handleNavigation = () =>
        push(`/projects/${projectId}/board?sprint=${sprint.id}`)

    const { data: tasks = [], isLoading: tasksLoading } = useQuery(
        ['tasks', { projectId, milestone: sprint.id }],
        async (key, { projectId, milestone }) => {
            const tasks = await getTasks({ projectId, milestone })
            return tasks.filter((t) => t.user_story === null)
        }
    )

    const startDate = new Date(sprint.estimated_start)
    const endDate = new Date(sprint.estimated_finish)
    const today = new Date()

    const active = startDate <= today && today <= endDate
    const closed = sprint?.closed
    return (
        <Skeleton loading={tasksLoading} active>
            <CustomCollapse
                primaryAction={
                    active &&
                    !closed && (
                        <SprintCompletionModal milestoneId={sprint?.id} />
                    )
                }
                actions={[
                    { title: 'Remove Sprint', action: handleRemove },
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
                        ...sprint.user_stories.filter(
                            (story) => !story.is_closed
                        ),
                        ...tasks.filter((task) => !task.is_closed),
                    ]}
                />
            </CustomCollapse>
        </Skeleton>
    )
}

export default Sprint
