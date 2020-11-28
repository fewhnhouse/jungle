import { GetStaticProps } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { QueryCache, useQuery } from 'react-query'
import { dehydrate } from 'react-query/hydration'
import Activity from '../../../../components/activity/Activity'
import { getProject, getProjects } from '../../../../taiga-api/projects'
import { getProjectTimeline } from '../../../../taiga-api/timelines'

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

export default function ProjectActivity() {
    const { projectId } = useRouter().query
    const { data: project } = useQuery(
        ['project', { projectId }],
        (key, { projectId }) => getProject(projectId),
        { enabled: projectId }
    )

    const { data, isLoading } = useQuery(
        ['timeline', { projectId }],
        (key, { projectId }) => getProjectTimeline(projectId),
        { enabled: projectId }
    )

    return (
        <>
            <Head>
                <title>Activity: {project?.name}</title>
                <meta
                    name="viewport"
                    content="initial-scale=1.0, width=device-width"
                />
            </Head>
            <Activity
                activity={data ?? []}
                isLoading={isLoading}
                title="Project Activity"
                description={`All activity from ${project?.name}`}
                avatarUrl={project?.logo_big_url}
            />
        </>
    )
}
