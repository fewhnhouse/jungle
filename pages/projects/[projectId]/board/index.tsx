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
import { useState } from 'react'
const { Option } = Select

const ParentContainer = styled.div``

type GroupBy = 'none' | 'epic' | 'subtask' | 'assignee'

export default function BoardContainer() {
    const router = useRouter()
    const [groupBy, setGroupBy] = useState<GroupBy>('none')
    const [selectedSprint, setSelectedSprint] = useState<number>(-1)
    const [assignee, setAssignee] = useState<number>()
    const { projectId } = router.query
    const { data: milestones } = useQuery(
        'milestones',
        () => getMilestones({ projectId: projectId as string, closed: false }),
        { enabled: projectId }
    )
    const sprint =
        selectedSprint !== -1
            ? milestones?.find((ms) => ms.id === selectedSprint)
            : {
                  name: 'All',
                  user_stories:
                      milestones?.flatMap((ms) => ms.user_stories) ?? [],
                  id: -1,
              }
    console.log(sprint?.user_stories)
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
                    <Select
                        style={{ width: 100 }}
                        value={groupBy}
                        onChange={(value: GroupBy) => setGroupBy(value)}
                        placeholder="Group by..."
                    >
                        <Option value="none">None</Option>
                        <Option value="assignee">Assignee</Option>
                        <Option value="epic">Epic</Option>
                        <Option value="subtask">Subtask</Option>
                    </Select>
                    <Select
                        value={selectedSprint}
                        onChange={(value) => setSelectedSprint(value)}
                        style={{ width: 100 }}
                        placeholder="Select sprint..."
                    >
                        <Option value={-1}>All</Option>
                        {milestones?.map((ms) => (
                            <Option value={ms.id} key={ms.id}>
                                {ms.name}
                            </Option>
                        ))}
                    </Select>
                    <AssigneeDropdown
                        value={assignee}
                        onChange={(id) => setAssignee(id)}
                    />
                </Flex>
            </PageHeader>
            <PageBody>
                <ParentContainer>
                    {groupBy === 'subtask' &&
                        sprint?.user_stories
                            .filter(
                                (story) =>
                                    !assignee || story.assigned_to === assignee
                            )
                            .map((story) => {
                                return (
                                    <Board
                                        title={story.subject}
                                        key={story.id}
                                        storyId={story.id.toString()}
                                        milestoneId={story.milestone.toString()}
                                        columns={taskFiltersData?.statuses}
                                    />
                                )
                            })}
                    {groupBy === 'none' && (
                        <StoryBoard
                            title={`${sprint?.name}`}
                            stories={
                                sprint?.user_stories.filter(
                                    (story) =>
                                        !assignee ||
                                        story.assigned_to === assignee
                                ) ?? []
                            }
                            milestoneIds={[sprint?.id ?? -1]}
                            columns={storyFiltersData?.statuses ?? []}
                        />
                    )}
                </ParentContainer>
            </PageBody>
        </>
    )
}
