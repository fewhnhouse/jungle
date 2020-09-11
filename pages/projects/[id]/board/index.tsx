import Board from '../../../../components/board/Board'
import styled from 'styled-components'
import { useRouter } from 'next/router'
import { useQuery } from 'react-query'
import { getMilestones, getMilestone } from '../../../../api/milestones'
import { getFiltersData } from '../../../../api/tasks'

const ParentContainer = styled.div``

export default function BoardContainer() {
    const router = useRouter()
    const { id } = router.query
    const { data: milestones } = useQuery(
        'milestones',
        () => getMilestones({ projectId: id as string, closed: false }),
        { enabled: id }
    )
    const milestone = milestones?.length ? milestones[0] : undefined
    const { data: sprint } = useQuery(
        ['milestone', { milestoneId: milestone?.id }],
        async (key, { milestoneId }) => {
            return getMilestone(milestoneId.toString())
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
        ['taskFilters', { id }],
        async (key, { id }) => {
            return getFiltersData(id as string)
        },
        { enabled: id }
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

    console.log(taskFiltersData)
    return (
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
    )
}
