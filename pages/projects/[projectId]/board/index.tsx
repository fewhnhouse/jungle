import Board from '../../../../components/board/Board'
import styled from 'styled-components'
import { useRouter } from 'next/router'
import { useQuery } from 'react-query'
import { getMilestones, getMilestone } from '../../../../taiga-api/milestones'
import { getFiltersData } from '../../../../taiga-api/tasks'
import { getFiltersData as getStoryFiltersData } from '../../../../taiga-api/userstories'
import { PageBody, PageHeader } from '../../../../components/Layout'
import PageTitle from '../../../../components/PageTitle'
import StoryBoard from '../../../../components/board/StoryBoard'
import { Select } from 'antd'
import AssigneeDropdown from '../../../../components/AssigneeDropdown'
import Flex from '../../../../components/Flex'
const { Option } = Select

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

    const { data: taskFiltersData } = useQuery(
        ['taskFilters', { projectId }],
        async (key, { projectId }) => {
            return getFiltersData(projectId as string)
        },
        { enabled: projectId }
    )

    const { data: storyFiltersData } = useQuery(
        ['taskFilters', { projectId }],
        async (key, { projectId }) => {
            return getStoryFiltersData(projectId as string)
        },
        { enabled: projectId }
    )

    // TODO: Figure out if we can use the active sprint to query data rather than userstories endpoint
    if (milestones && !milestones.length) {
        return <div>No sprint active.</div>
    }

    return (
        <>
            <PageHeader>
                <PageTitle title="Board" />
                <Flex>
                    <Select placeholder="Group by...">
                        <Option value="none">None</Option>
                        <Option value="assignee">Assignee</Option>
                        <Option value="epic">Epic</Option>
                        <Option value="subtask">Subtask</Option>
                    </Select>
                    <AssigneeDropdown />
                </Flex>
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
                    <StoryBoard
                        title={`TODO: SPRINT: ${sprint.name}`}
                        stories={sprint.user_stories}
                        milestoneId={sprint.id.toString()}
                        columns={storyFiltersData?.statuses}
                    />
                </ParentContainer>
            </PageBody>
        </>
    )
}
