import { GetStaticProps } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { QueryCache, useQuery } from 'react-query'
import { dehydrate } from 'react-query/hydration'
import Activity from '../../../../components/activity/Activity'
import { getProjects } from '../../../../taiga-api/projects'
import { getUserTimeline } from '../../../../taiga-api/timelines'
import { getUser, getUsers } from '../../../../taiga-api/users'

export const getStaticProps: GetStaticProps = async (context) => {
    const queryCache = new QueryCache()
    try {
        await queryCache.prefetchQuery('timeline', () =>
            getUserTimeline(parseInt(context.params.id as string, 10))
        )
        await queryCache.prefetchQuery(
            ['user', { userId: context.params.id }],
            (_, { userId }) => getUser(userId as string)
        )
        await queryCache.prefetchQuery(
            ['projects', { userId: context.params.id }],
            () => getProjects({ member: context.params.id as string })
        )
    } catch (e) {
        console.error(e)
    }

    return {
        props: {
            dehydratedState: dehydrate(queryCache),
        },
        revalidate: 5,
    }
}

export async function getStaticPaths() {
    const users = await getUsers()
    return {
        paths: users.map((user) => ({ params: { id: user.id.toString() } })),
        fallback: true, // See the "fallback" section below
    }
}

export default function ProjectActivity() {
    const { id } = useRouter().query
    const { data: user } = useQuery(['user', { userId: id }], (_, { userId }) =>
        getUser(userId as string)
    )

    const { data: timeline, isLoading } = useQuery(
        ['timeline', { id }],
        (key, { id }) => getUserTimeline(id),
        { enabled: !!id }
    )

    return (
        <>
            <Head>
                <title>Activity: {user?.full_name}</title>
                <meta
                    name="viewport"
                    content="initial-scale=1.0, width=device-width"
                />
            </Head>
            <Activity
                activity={timeline ?? []}
                isLoading={isLoading}
                title="User Activity"
                description={`All activity from ${user?.full_name}`}
                avatarUrl={user?.big_photo}
            />
        </>
    )
}
