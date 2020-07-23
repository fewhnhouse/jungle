import Board from '../../../../components/board/Board'
import styled from 'styled-components'
import useSWR from 'swr'
import { useRouter } from 'next/router'
import { IUserStory } from '../../../../interfaces/UserStory'

const ParentContainer = styled.div``

export default function BoardContainer() {
    const { id } = useRouter().query
    console.log(id)
    const { data: storyFiltersData } = useSWR(
        `/userstories/filters_data?project=${id}`
    )
    const { data: taskFiltersData } = useSWR(
        `/tasks/filters_data?project=${id}`
    )
    const { data, error } = useSWR<IUserStory[]>(
        `/userstories?project=${id}&include_tasks=true`
    )

    return (
        <ParentContainer>
            {data?.map((story) => {
                return (
                    <Board
                        title={story.subject}
                        key={story.id}
                        id={`board-${story.id}`}
                        data={story.tasks}
                        columns={taskFiltersData?.statuses}
                    />
                )
            })}
        </ParentContainer>
    )
}
