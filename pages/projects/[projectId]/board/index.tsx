import Board from '../../../../components/board/Board'
import styled from 'styled-components'
import { useRouter } from 'next/router'
import { useQuery } from 'react-query'
import { getMilestones, getMilestone } from '../../../../taiga-api/milestones'
import { getFiltersData } from '../../../../taiga-api/tasks'
import { PageBody, PageHeader } from '../../../../components/Layout'
import PageTitle from '../../../../components/PageTitle'

const ParentContainer = styled.div``

export default function BoardContainer() {
    const router = useRouter()
    const { projectId } = router.query
    const { data: milestones } = useQuery(
        'milestones',
        () => getMilestones({ projectId: projectId as string, closed: false }),
        { enabled: projectId }
    )
    const milestone = milestones?.length ? milestones[0] : undefined
    const { data: sprint } = useQuery(
        ['milestone', { milestoneId: milestone?.id }],
        async (key, { milestoneId }) => {
            return getMilestone(milestoneId)
        },
        { enabled: milestones }
    )
    /*const { data: storyFiltersData } = useQuery(
        'userstoryFilters',
        async () => {
            const { data } = await authInstance.get(
                `/userstories/filters_data?project=${id}`
            )
            return data
        }
    )*/
    const { data: taskFiltersData } = useQuery(
        ['taskFilters', { projectId }],
        async (key, { projectId }) => {
            return getFiltersData(projectId as string)
        },
        { enabled: projectId }
    )
    // TODO: Figure out if we can use the active sprint to query data rather than userstories endpoint
    if (milestones && !milestones.length) {
        return <div>No sprint active.</div>
    }
    /*
    const { data, error } = useQuery('userstories', async () => {
        const { data } = await authInstance.get<UserStory[]>(
            `/userstories?project=${id}&include_tasks=true`
        )
        return data
    })
    */

    return (
        <>
            <PageHeader>
                <PageTitle title="Board" />
            </PageHeader>
            <PageBody>
                <ParentContainer>
                    {sprint?.user_stories.map((story) => {
                        return (
                            <Board
                                title={story.subject}
                                key={story.id}
                                storyId={story.id.toString()}
                                milestoneId={sprint.id.toString()}
                                columns={taskFiltersData?.statuses}
                            />
                        )
                    })}
                </ParentContainer>
            </PageBody>
        </>
    )
}
