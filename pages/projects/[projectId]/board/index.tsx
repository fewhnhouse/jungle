import styled from 'styled-components'
import { useRouter } from 'next/router'
import { useQuery } from 'react-query'
import { getMilestones } from '../../../../taiga-api/milestones'
import { getFiltersData, getTasks, Task } from '../../../../taiga-api/tasks'
import { getFiltersData as getStoryFiltersData } from '../../../../taiga-api/userstories'
import { PageBody, PageHeader } from '../../../../components/Layout'
import PageTitle from '../../../../components/PageTitle'
import TaskBoard from '../../../../components/board/TaskBoard'
import StoryBoard from '../../../../components/board/StoryBoard'
import { Divider, Empty, Form, Select } from 'antd'
import AssigneeDropdown from '../../../../components/AssigneeDropdown'
import Flex from '../../../../components/Flex'
import { useState } from 'react'
import { getProject } from '../../../../taiga-api/projects'
const { Option } = Select
const { Item } = Form

const ParentContainer = styled.div``

const DateDescription = styled.span`
    font-size: 12px;
    color: #ccc;
`

type GroupBy = 'none' | 'epic' | 'subtask' | 'assignee'

export default function BoardContainer() {
    const router = useRouter()
    const [groupBy, setGroupBy] = useState<GroupBy>('none')
    const [selectedSprint, setSelectedSprint] = useState<number>(-1)
    const [assignee, setAssignee] = useState<number>()
    const { projectId } = router.query

    const { data: project } = useQuery(
        ['project', { projectId }],
        (key, { projectId }) => getProject(projectId as string),
        { enabled: projectId }
    )

    const { data: milestones } = useQuery(
        'milestones',
        () => getMilestones({ projectId: projectId as string, closed: false }),
        { enabled: projectId }
    )

    const milestoneIds =
        selectedSprint !== -1
            ? [milestones.find((m) => m.id === selectedSprint).id]
            : milestones?.map((m) => m.id)

    const { data: tasks } = useQuery(
        [
            'tasks',
            {
                projectId,
                milestoneIds,
            },
        ],
        (
            key,
            {
                projectId,
                milestoneIds,
            }: { projectId: string; milestoneIds: number[] }
        ) =>
            Promise.all(
                milestoneIds.map(
                    async (milestone) =>
                        await getTasks({
                            projectId,
                            milestone: milestone.toString(),
                        })
                )
            ).then((res) => res.flat()),
        { enabled: !!milestones && groupBy === 'subtask' }
    )

    const orderedTasks: {
        storySubject: string
        tasks: Task[]
        storyId: number
    }[] =
        tasks?.reduce(
            (prev, curr) => {
                if (!curr.user_story) {
                    return prev.map((p) =>
                        !p.storyId ? { ...p, tasks: [...p.tasks, curr] } : p
                    )
                }
                if (prev.find((p) => p.storyId === curr.user_story)) {
                    return prev.map((p) =>
                        p.storyId === curr.user_story
                            ? { ...p, tasks: [...p.tasks, curr] }
                            : p
                    )
                } else {
                    return [
                        ...prev,
                        {
                            storyId: curr.user_story,
                            storySubject: curr.user_story_extra_info.subject,
                            tasks: [curr],
                        },
                    ]
                }
            },
            [{ storyId: null, storySubject: 'Tasks without Story', tasks: [] }]
        ) ?? []

    const sprint =
        selectedSprint !== -1
            ? milestones?.find((ms) => ms.id === selectedSprint)
            : {
                  name: 'All',
                  user_stories:
                      milestones?.flatMap((ms) => ms.user_stories) ?? [],
                  id: -1,
              }

    const { data: taskFiltersData } = useQuery(
        ['taskFilters', { projectId }],
        async (key, { projectId }) => {
            return getFiltersData(projectId as string)
        },
        { enabled: projectId }
    )

    const { data: storyFiltersData } = useQuery(
        ['storyFilters', { projectId }],
        async (key, { projectId }) => {
            return getStoryFiltersData(projectId as string)
        },
        { enabled: projectId }
    )

    // TODO: Figure out if we can use the active sprint to query data rather than userstories endpoint
    if (milestones && !milestones.length) {
        return <Empty description="No sprint active" />
    }

    return (
        <>
            <PageHeader>
                <PageTitle title="Board" />
                <Flex>
                    <Form layout="inline">
                        <Item label="Group by">
                            <Select
                                style={{ width: 120 }}
                                value={groupBy}
                                onChange={(value: GroupBy) => setGroupBy(value)}
                                placeholder="Group by..."
                            >
                                <Option value="none">None</Option>
                                <Option value="assignee">Assignee</Option>
                                <Option value="epic">Epic</Option>
                                <Option value="subtask">Subtask</Option>
                            </Select>
                        </Item>
                        <Item label="Sprints">
                            <Select
                                value={selectedSprint}
                                onChange={(value) => setSelectedSprint(value)}
                                style={{ width: 160 }}
                                placeholder="Select sprint..."
                            >
                                <Option value={-1}>All</Option>
                                {milestones?.map((ms) => (
                                    <Option value={ms.id} key={ms.id}>
                                        {ms.name}
                                        <br />
                                        <DateDescription>
                                            {new Date(
                                                ms.estimated_start
                                            ).toLocaleDateString(undefined, {
                                                year: '2-digit',
                                                month: 'numeric',
                                                day: 'numeric',
                                            })}{' '}
                                            -{' '}
                                            {new Date(
                                                ms.estimated_finish
                                            ).toLocaleDateString(undefined, {
                                                year: '2-digit',
                                                month: 'numeric',
                                                day: 'numeric',
                                            })}
                                        </DateDescription>
                                    </Option>
                                ))}
                            </Select>
                        </Item>
                        {groupBy !== 'assignee' && (
                            <Item label="Assignee">
                                <AssigneeDropdown
                                    value={assignee}
                                    onChange={(id) => setAssignee(id)}
                                />
                            </Item>
                        )}
                    </Form>
                </Flex>
            </PageHeader>
            <PageBody>
                <ParentContainer>
                    {groupBy === 'subtask' &&
                        orderedTasks?.map((orderedTask) => {
                            return (
                                <TaskBoard
                                    milestoneIds={milestoneIds}
                                    title={orderedTask.storySubject}
                                    key={orderedTask.storyId}
                                    tasks={orderedTask.tasks.filter(
                                        (t) =>
                                            !assignee ||
                                            t.assigned_to === assignee
                                    )}
                                    columns={taskFiltersData?.statuses}
                                />
                            )
                        })}
                    {groupBy === 'subtask' && (
                        <StoryBoard
                            title="Issues without Subtask"
                            stories={
                                sprint?.user_stories.filter(
                                    (story) => story.tasks?.length === 0
                                ) ?? []
                            }
                            milestoneIds={milestoneIds}
                            columns={storyFiltersData?.statuses ?? []}
                        />
                    )}
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
                            milestoneIds={milestoneIds}
                            columns={storyFiltersData?.statuses ?? []}
                        />
                    )}

                    {groupBy === 'assignee' &&
                        project?.members.map((member) => (
                            <StoryBoard
                                key={member.id}
                                title={`${member?.full_name}`}
                                stories={
                                    sprint?.user_stories.filter(
                                        (story) =>
                                            story.assigned_to === member.id
                                    ) ?? []
                                }
                                milestoneIds={milestoneIds}
                                columns={storyFiltersData?.statuses ?? []}
                            />
                        ))}
                    {groupBy === 'assignee' && (
                        <StoryBoard
                            title="Unassigned"
                            stories={
                                sprint?.user_stories.filter(
                                    (story) => story.assigned_to === null
                                ) ?? []
                            }
                            milestoneIds={milestoneIds}
                            columns={storyFiltersData?.statuses ?? []}
                        />
                    )}
                </ParentContainer>
            </PageBody>
        </>
    )
}
