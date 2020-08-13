import Board from '../../../../components/board/Board'
import styled from 'styled-components'
import { useRouter } from 'next/router'
import { IUserStory, Task } from '../../../../interfaces/UserStory'
import { IMilestone } from '../../../../interfaces/Project'
import axios, { AxiosResponse } from 'axios'
import { useQuery } from 'react-query'

const ParentContainer = styled.div``

export default function BoardContainer() {
    const { id } = useRouter().query
    const { data: storyFiltersData } = useQuery(
        'userstoryFilters',
        async () => {
            const { data } = await axios.get(
                `/userstories/filters_data?project=${id}`
            )
            return data
        }
    )
    const { data: taskFiltersData } = useQuery('taskFilters', async () => {
        const { data } = await axios.get(`/tasks/filters_data?project=${id}`)
        return data
    })
    // TODO: Figure out if we can use the active sprint to query data rather than userstories endpoint
    const milestoneId = 2
    const { data: sprint } = useQuery('milestones', async () => {
        const { data } = await axios.get<IMilestone>(
            `/milestones/${milestoneId}`
        )
        return data
    })

    const { data, error } = useQuery('userstories', async () => {
        const { data } = await axios.get<IUserStory[]>(
            `/userstories?project=${id}&include_tasks=true`
        )
        return data
    })

    return (
        <ParentContainer>
            {sprint?.user_stories.map((story) => {
                return (
                    <Board
                        title={story.subject}
                        key={story.id}
                        id={story.id}
                        columns={taskFiltersData?.statuses}
                    />
                )
            })}
        </ParentContainer>
    )
}
