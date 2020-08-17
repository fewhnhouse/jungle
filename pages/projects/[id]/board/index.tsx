import Board from '../../../../components/board/Board'
import styled from 'styled-components'
import { useRouter } from 'next/router'
import { useQuery } from 'react-query'
import authInstance from '../../../../util/axiosInstance'
import {
    Milestone,
    getMilestones,
    getMilestone,
} from '../../../../api/milestones'
import { UserStory } from '../../../../api/userstories'

const ParentContainer = styled.div``

export default function BoardContainer() {
    const { id } = useRouter().query
    const { data: milestones } = useQuery('milestones', (key) => getMilestones())
    const milestone = milestones?.length ? milestones[0] : undefined
    const { data: sprint } = useQuery(
        ['milestone', { milestoneId: milestone.id }],
        async (key, { milestoneId }) => {
            const { data } = await getMilestone(milestoneId.toString())
            return data
        }
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
    const { data: taskFiltersData } = useQuery('taskFilters', async () => {
        const { data } = await authInstance.get(
            `/tasks/filters_data?project=${id}`
        )
        return data
    })
    // TODO: Figure out if we can use the active sprint to query data rather than userstories endpoint
    if (!milestones || !milestones.length) {
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
        <ParentContainer>
            {sprint?.user_stories.map((story) => {
                return (
                    <Board
                        title={story.subject}
                        key={story.id}
                        id={story.id.toString()}
                        columns={taskFiltersData?.statuses}
                    />
                )
            })}
        </ParentContainer>
    )
}
