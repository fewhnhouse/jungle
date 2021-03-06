import { useRouter } from 'next/router'
import { QueryCache, useQuery } from 'react-query'
import { getMilestones } from '../../../../taiga-api/milestones'
import { getFiltersData, getTasks, Task } from '../../../../taiga-api/tasks'
import {
    getFiltersData as getStoryFiltersData,
    getUserstories,
    UserStory,
} from '../../../../taiga-api/userstories'
import { PageBody, PageHeader } from '../../../../components/Layout'
import PageTitle from '../../../../components/PageTitle'
import TaskBoard from '../../../../components/board/TaskBoard'
import StoryBoard from '../../../../components/board/StoryBoard'
import { Button, Empty, Skeleton } from 'antd'
import Flex from '../../../../components/Flex'
import { getProject, getProjects } from '../../../../taiga-api/projects'
import FilterBoard, { GroupBy } from '../../../../components/board/FilterBoard'
import Link from 'next/link'
import useQueryState from '../../../../util/useQueryState'
import { ScrollSync } from 'react-scroll-sync'
import Head from 'next/head'
import { GetStaticProps } from 'next'
import { dehydrate } from 'react-query/hydration'
import { FilterOutlined } from '@ant-design/icons'
import useMedia from 'use-media'
import { useState } from 'react'

export async function getStaticPaths() {
    const projects = await getProjects()
    return {
        paths: projects
            .filter((project) => !project.is_private)
            .map((project) => ({
                params: { projectId: project.id.toString() },
            })),
        fallback: true,
    }
}

export const getStaticProps: GetStaticProps = async (context) => {
    const queryCache = new QueryCache()
    const projectId = context.params.projectId as string

    await queryCache.prefetchQuery(
        ['project', { projectId }],
        (key, { projectId }) => getProject(projectId)
    )

    await queryCache.prefetchQuery(
        ['milestones', { projectId }],
        (key, { projectId }) =>
            getMilestones({
                closed: false,
                projectId: projectId,
            })
    )

    await queryCache.prefetchQuery(
        ['tasks', { projectId }],
        (key, { projectId }) => getTasks({ projectId })
    )

    await queryCache.prefetchQuery(
        ['userstories', { projectId }],
        (key, { projectId }) => getUserstories({ projectId })
    )

    return {
        props: {
            dehydratedState: dehydrate(queryCache),
        },
        revalidate: 10,
    }
}

export default function BoardContainer() {
    const router = useRouter()
    const [groupBy, setGroupBy] = useQueryState<GroupBy>('groupBy', 'none')
    const [search, setSearch] = useQueryState<string>('search', '')
    const [selectedSprint, setSelectedSprint] = useQueryState<
        number | undefined
    >('sprint', undefined)
    const [assignees, setAssignees] = useQueryState<number[]>('assignee', [])
    const { projectId } = router.query
    const isMobile = useMedia('(max-width: 700px)')
    const [filterOpen, setFilterOpen] = useState(false)

    const { data: project, isLoading } = useQuery(
        ['project', { projectId }],
        (key, { projectId }) => getProject(projectId as string),
        { enabled: projectId }
    )

    const { data: milestones, isLoading: isMilestonesLoading } = useQuery(
        ['milestones', { projectId }],
        () => getMilestones({ projectId: projectId as string, closed: false }),
        { enabled: projectId, refetchInterval: 5000 }
    )

    const { data: userstories, isLoading: isUserstoriesLoading } = useQuery(
        ['userstories', { projectId }],
        () => getUserstories({ projectId: projectId as string }),
        { enabled: projectId, refetchInterval: 5000 }
    )

    const { data: taskFiltersData } = useQuery(
        ['taskFilters', { projectId }],
        async (key, { projectId }) => {
            return getFiltersData(projectId as string)
        },
        { enabled: projectId }
    )

    const sortedTaskStatuses = taskFiltersData?.statuses?.sort(
        (a, b) => a.order - b.order
    )

    const { data: storyFiltersData } = useQuery(
        ['storyFilters', { projectId }],
        async (key, { projectId }) => {
            return getStoryFiltersData(projectId as string)
        },
        { enabled: projectId }
    )

    const sortedStoryStatuses = storyFiltersData?.statuses?.sort(
        (a, b) => a.order - b.order
    )

    const milestoneIds = selectedSprint
        ? [selectedSprint]
        : milestones?.map((m) => m.id)

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
        { enabled: groupBy === 'subtask', refetchInterval: 5000 }
    )

    const orderedTasks: {
        storySubject: string
        tasks: Task[]
        storyId: number
    }[] =
        tasks?.reduce(
            (prev, curr) => {
                //T asks without userstory parent
                if (!curr.user_story) {
                    return prev.map((p) =>
                        p.storyId === null
                            ? { ...p, tasks: [...p.tasks, curr] }
                            : p
                    )
                }
                // Tasks with userstory parent (existing)
                if (prev.find((p) => p.storyId === curr.user_story)) {
                    return prev.map((p) =>
                        p.storyId === curr.user_story
                            ? { ...p, tasks: [...p.tasks, curr] }
                            : p
                    )
                }
                // Tasks with userstory parent (new)
                else {
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
            [
                {
                    storyId: null,
                    storySubject: 'Tasks without Story',
                    tasks: [],
                },
            ]
        ) ?? []

    const openMilestones = milestones?.filter((ms) => !ms.closed)
    const sprint = openMilestones?.find((ms) => ms.id === selectedSprint)

    const toggleFilters = () => setFilterOpen((open) => !open)
    const searchFilter = (issue: Task | UserStory) => {
        const regex = new RegExp(search, 'i')
        return regex.test(issue.subject) || regex.test(issue.id.toString())
    }

    const assigneeFilter = (assignees: number[]) => (issue: Task | UserStory) =>
        !assignees ||
        assignees?.length === 0 ||
        assignees?.includes(issue.assigned_to)

    const sprintFilter = (milestone: { id: number }) => (
        issue: Task | UserStory
    ) => !milestone || issue.milestone === milestone.id

    const hasMilestoneFilter = (issue: Task | UserStory) =>
        issue.milestone !== null

    return (
        <ScrollSync>
            <>
                <Head>
                    <title>Board: {project?.name}</title>
                    <meta
                        name="viewport"
                        content="initial-scale=1.0, width=device-width"
                    />
                </Head>
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
                        actions={
                            isMobile && (
                                <Button
                                    type={filterOpen ? 'primary' : 'default'}
                                    icon={<FilterOutlined />}
                                    onClick={toggleFilters}
                                >
                                    {filterOpen
                                        ? 'Hide Filters'
                                        : 'Show Filters'}
                                </Button>
                            )
                        }
                    />
                    <Flex>
                        {!!openMilestones?.length && (
                            <FilterBoard
                                isOpen={filterOpen || !isMobile}
                                groupBy={groupBy}
                                setGroupBy={setGroupBy}
                                assignees={assignees}
                                setAssignees={setAssignees}
                                sprint={selectedSprint}
                                setSprint={setSelectedSprint}
                                milestones={openMilestones.filter(
                                    (ms) => !ms.closed
                                )}
                                search={search}
                                setSearch={setSearch}
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
                                            tasks={orderedTask.tasks
                                                ?.filter(hasMilestoneFilter)
                                                ?.filter(searchFilter)
                                                ?.filter(
                                                    assigneeFilter(assignees)
                                                )}
                                            columns={sortedTaskStatuses}
                                        />
                                    )
                                })}
                            {groupBy === 'sprint' &&
                                openMilestones.map((ms, index) => (
                                    <StoryBoard
                                        key={ms.id}
                                        hasHeader={index === 0}
                                        title={`${ms?.name}`}
                                        stories={
                                            userstories
                                                ?.filter(hasMilestoneFilter)
                                                ?.filter(searchFilter)
                                                ?.filter(sprintFilter(ms))
                                                ?.filter(
                                                    assigneeFilter(assignees)
                                                ) ?? []
                                        }
                                        columns={sortedStoryStatuses ?? []}
                                    />
                                ))}
                            {groupBy === 'none' && (
                                <StoryBoard
                                    hasHeader
                                    title={`${sprint?.name ?? 'All'}`}
                                    stories={
                                        userstories
                                            ?.filter(hasMilestoneFilter)
                                            ?.filter(searchFilter)
                                            ?.filter(assigneeFilter(assignees))
                                            ?.filter(sprintFilter(sprint)) ?? []
                                    }
                                    columns={sortedStoryStatuses ?? []}
                                />
                            )}

                            {groupBy === 'assignee' &&
                                project?.members.map((member, index) => (
                                    <StoryBoard
                                        hasHeader={index === 0}
                                        key={member.id}
                                        title={`${member?.full_name}`}
                                        stories={
                                            userstories
                                                ?.filter(hasMilestoneFilter)
                                                ?.filter(searchFilter)
                                                ?.filter(
                                                    assigneeFilter([member.id])
                                                )
                                                ?.filter(
                                                    sprintFilter(sprint)
                                                ) ?? []
                                        }
                                        columns={sortedStoryStatuses ?? []}
                                    />
                                ))}
                            {groupBy === 'assignee' && (
                                <StoryBoard
                                    title="Unassigned"
                                    stories={
                                        userstories
                                            ?.filter(hasMilestoneFilter)
                                            ?.filter(searchFilter)
                                            ?.filter(assigneeFilter([]))
                                            ?.filter(sprintFilter(sprint)) ?? []
                                    }
                                    columns={sortedStoryStatuses ?? []}
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
