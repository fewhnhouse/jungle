import Board from '../../../../components/board/Board'
import { sprint } from '../../../../util/data'
import styled from 'styled-components'
import useSWR from 'swr'
import { useRouter } from 'next/router'
import { IUserStory } from '../../../../interfaces/UserStory'

const ParentContainer = styled.div``

export default function BoardContainer() {
    const { id } = useRouter().query
    const { data: storyFiltersData } = useSWR(
        `/userstories/filters_data?project=${id}`
    )
    const { data: taskFiltersData } = useSWR(
        `/tasks/filters_data?project=${id}`
    )
    const { data, error } = useSWR<IUserStory[]>(
        `/userstories?project=${id}&include_tasks=true`
    )

    console.log(data, storyFiltersData, taskFiltersData)

    const columns = taskFiltersData?.statuses.map((status) => status.name)
    return (
        <ParentContainer>
            {data?.map((story) => {
                console.log(story)
                return (
                    <Board
                        key={story.id}
                        id={`board-${story.id}`}
                        data={story.tasks}
                        columns={columns}
                    />
                )
            })}
        </ParentContainer>
    )
}
