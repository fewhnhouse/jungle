import { GetStaticProps } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { QueryCache, useQuery } from 'react-query'
import { dehydrate } from 'react-query/hydration'
import YourWork from '../../../../components/your-work/YourWork'
import { getProject, getProjects } from '../../../../taiga-api/projects'
import { getProjectTimeline, Timeline } from '../../../../taiga-api/timelines'
import { recentTaskFilter } from '../../../../util/recentTaskFilter'

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

    await queryCache.prefetchQuery(
        ['project', { projectId: context.params.projectId as string }],
        (key, { projectId }) => getProject(projectId as string)
    )

    await queryCache.prefetchQuery(
        ['timeline', { projectId: context.params.projectId as string }],
        (key, { projectId }) => getProjectTimeline(projectId as string)
    )

    return {
        props: {
            dehydratedState: dehydrate(queryCache),
        },
        revalidate: 10,
    }
}

export default function ProjectWork() {
    const { projectId } = useRouter().query
    const { data: project } = useQuery(
        ['project', { projectId }],
        (key, { projectId }) => getProject(projectId),
        { enabled: projectId }
    )

    const { data: timeline, isLoading } = useQuery(
        ['timeline', { projectId }],
        (key, { projectId }) => getProjectTimeline(projectId),
        { enabled: projectId }
    )

    const recentTasks: Timeline[] = recentTaskFilter(timeline)

    return (
        <>
            <Head>
                <title>{project?.name} Work Items</title>
                <meta
                    name="viewport"
                    content="initial-scale=1.0, width=device-width"
                />
            </Head>

            <YourWork
                timeline={recentTasks ?? []}
                isLoading={isLoading}
                title="Project Work Items"
                description={`All recent work items from ${project?.name}`}
                avatarUrl={project?.logo_big_url}
            />
        </>
    )
}
