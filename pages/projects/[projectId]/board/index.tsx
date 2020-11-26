import { useRouter } from 'next/router'
import { useQuery } from 'react-query'
import { getMilestones } from '../../../../taiga-api/milestones'
import { getFiltersData, getTasks, Task } from '../../../../taiga-api/tasks'
import { getFiltersData as getStoryFiltersData } from '../../../../taiga-api/userstories'
import { PageBody, PageHeader } from '../../../../components/Layout'
import PageTitle from '../../../../components/PageTitle'
import TaskBoard from '../../../../components/board/TaskBoard'
import StoryBoard from '../../../../components/board/StoryBoard'
import { Empty, Skeleton } from 'antd'
import Flex from '../../../../components/Flex'
import { getProject } from '../../../../taiga-api/projects'
import FilterBoard, { GroupBy } from '../../../../components/board/FilterBoard'
import Link from 'next/link'
import useQueryState from '../../../../util/useQueryState'
import { ScrollSync } from 'react-scroll-sync'

export default function BoardContainer() {
    const router = useRouter()
    const [groupBy, setGroupBy] = useQueryState<GroupBy>('groupBy', 'none')
    const [selectedSprint, setSelectedSprint] = useQueryState<number>(
        'sprint',
        -1
    )
    const [assignee, setAssignee] = useQueryState<number>('assignee')
    const { projectId } = router.query

    const { data: project, isLoading } = useQuery(
        ['project', { projectId }],
        (key, { projectId }) => getProject(projectId as string),
        { enabled: projectId }
    )

    const { data: milestones, isLoading: isMilestonesLoading } = useQuery(
        ['milestones', { projectId }],
        () => getMilestones({ projectId: projectId as string, closed: false }),
        { enabled: projectId }
    )

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

    const milestoneIds =
        selectedSprint !== -1 ? [selectedSprint] : milestones?.map((m) => m.id)

    const { data: tasks, isLoading: isTasksLoading } = useQuery(
        [
            'tasks',
            {
                projectId,
            },
        ],
        (key, { projectId }: { projectId: string; milestoneIds: number[] }) =>
            getTasks({
                projectId,
            }),
        { enabled: groupBy === 'subtask' }
    )

    const filteredTasks = tasks.filter((task) =>
        milestoneIds.includes(task.milestone)
    )

    const orderedTasks: {
        storySubject: string
        tasks: Task[]
        storyId: number
    }[] =
        filteredTasks?.reduce(
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
                        {
                            storyId: curr.user_story,
                            storySubject: curr.user_story_extra_info.subject,
                            tasks: [curr],
                        },
                        ...prev,
                    ]
                }
            },
            [{ storyId: null, storySubject: 'Tasks without Story', tasks: [] }]
        ) ?? []

    const openMilestones = milestones?.filter((ms) => !ms.closed)
    const sprint =
        selectedSprint !== -1
            ? openMilestones?.find((ms) => ms.id === selectedSprint)
            : {
                  name: 'All',
                  user_stories:
                      openMilestones?.flatMap((ms) => ms.user_stories) ?? [],
                  id: -1,
              }

    return (
        <ScrollSync>
            <>
                <PageHeader>
                    <PageTitle
                        breadcrumbs={[
                            { href: `/projects`, label: 'Projects' },
                            {
                                href: `/projects/${projectId}`,
                                label: project?.name,
                            },
                            {
                                href: `/projects/${projectId}/board`,
                                label: 'Board',
                            },
                        ]}
                        title="Board"
                    />
                    <Flex>
                        {!!openMilestones?.length && (
                            <FilterBoard
                                groupBy={groupBy}
                                setGroupBy={setGroupBy}
                                assignee={assignee}
                                setAssignee={setAssignee}
                                sprint={selectedSprint}
                                setSprint={setSelectedSprint}
                                milestones={openMilestones.filter(
                                    (ms) => !ms.closed
                                )}
                            />
                        )}
                    </Flex>
                </PageHeader>
                <PageBody>
                    {openMilestones?.length ? (
                        <div>
                            {groupBy === 'subtask' &&
                                orderedTasks?.map((orderedTask, index) => {
                                    return (
                                        <TaskBoard
                                            hasHeader={index === 0}
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
                                    columns={storyFiltersData?.statuses ?? []}
                                />
                            )}
                            {groupBy === 'sprint' &&
                                openMilestones.map((ms, index) => (
                                    <StoryBoard
                                        key={ms.id}
                                        hasHeader={index === 0}
                                        title={`${ms?.name}`}
                                        stories={
                                            ms?.user_stories.filter(
                                                (story) =>
                                                    !assignee ||
                                                    story.assigned_to ===
                                                        assignee
                                            ) ?? []
                                        }
                                        columns={
                                            storyFiltersData?.statuses ?? []
                                        }
                                    />
                                ))}
                            {groupBy === 'none' && (
                                <StoryBoard
                                    hasHeader
                                    title={`${sprint?.name}`}
                                    stories={
                                        sprint?.user_stories.filter(
                                            (story) =>
                                                !assignee ||
                                                story.assigned_to === assignee
                                        ) ?? []
                                    }
                                    columns={storyFiltersData?.statuses ?? []}
                                />
                            )}

                            {groupBy === 'assignee' &&
                                project?.members.map((member, index) => (
                                    <StoryBoard
                                        hasHeader={index === 0}
                                        key={member.id}
                                        title={`${member?.full_name}`}
                                        stories={
                                            sprint?.user_stories.filter(
                                                (story) =>
                                                    story.assigned_to ===
                                                    member.id
                                            ) ?? []
                                        }
                                        columns={
                                            storyFiltersData?.statuses ?? []
                                        }
                                    />
                                ))}
                            {groupBy === 'assignee' && (
                                <StoryBoard
                                    title="Unassigned"
                                    stories={
                                        sprint?.user_stories.filter(
                                            (story) =>
                                                story.assigned_to === null
                                        ) ?? []
                                    }
                                    columns={storyFiltersData?.statuses ?? []}
                                />
                            )}
                        </div>
                    ) : isMilestonesLoading || !projectId ? (
                        <Skeleton active />
                    ) : (
                        <Empty
                            description={
                                <>
                                    No Sprint active. Go to the{' '}
                                    <Link
                                        href={`/projects/${projectId}/backlog`}
                                    >
                                        Backlog
                                    </Link>{' '}
                                    to create one.
                                </>
                            }
                        />
                    )}
                </PageBody>
            </>
        </ScrollSync>
    )
}
