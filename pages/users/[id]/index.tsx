import styled from 'styled-components'
import Projects from '../../../components/home/Projects'
import { useState } from 'react'
import ProjectCreationModal from '../../../components/home/ProjectCreationModal'
import { getUser, getUsers } from '../../../taiga-api/users'
import PageTitle from '../../../components/PageTitle'
import { PageBody, PageHeader } from '../../../components/Layout'
import { QueryCache, useQuery } from 'react-query'
import { Button } from 'antd'
import { SettingOutlined } from '@ant-design/icons'
import Link from 'next/link'
import { ActionContainer } from '../../../components/project/Actions'
import LimitedActivity from '../../../components/activity/LimitedActivity'
import { getUserTimeline, Timeline } from '../../../taiga-api/timelines'
import { GetStaticProps, InferGetStaticPropsType } from 'next'
import { useRouter } from 'next/router'
import RecentTasks from '../../../components/your-work/LimitedYourWork'
import { recentTaskFilter } from '../../../util/recentTaskFilter'
import Head from 'next/head'
import { dehydrate } from 'react-query/hydration'

const Container = styled.div`
    padding: ${({ theme }) => `${theme.spacing.huge} ${theme.spacing.crazy}`};
    margin: auto;
    max-width: 1400px;
    display: flex;
    height: 100%;
    align-items: flex-start;
    @media screen and (max-width: 960px) {
        flex-direction: column;
        align-items: center;
    }
    @media screen and (max-width: 400px) {
        padding: ${({ theme }) =>
            `${theme.spacing.small} ${theme.spacing.medium}`};
    }
`

const HomeContainer = styled.div`
    padding: ${({ theme }) => theme.spacing.crazy};
    display: flex;
    justify-content: space-between;
    @media screen and (max-width: 400px) {
        padding: ${({ theme }) => theme.spacing.medium};
    }
`

const HeaderContainer = styled.div`
    display: flex;
    align-items: flex-start;
    width: 100%;
    justify-content: space-between;
`
const InnerContainer = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1;
`

const TitleContainer = styled.div`
    display: flex;
    flex: 3;
    flex-direction: column;
    margin-right: ${({ theme }) => theme.spacing.medium};
`

export const getStaticProps: GetStaticProps = async (context) => {
    const queryCache = new QueryCache()
    try {
        await queryCache.prefetchQuery('timeline', () =>
            getUserTimeline(parseInt(context.params.id as string, 10))
        )
        await queryCache.prefetchQuery('user', () =>
            getUser(context.params.id as string)
        )
        await queryCache.prefetchQuery('projects', () =>
            getProjects({ member: context.params.id as string })
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

export default function Home() {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const toggleModal = () => {
        setIsModalOpen((open) => !open)
    }

    const { id } = useRouter().query

    const { data: user } = useQuery('user', () => getUser(id.toString()))

    const { data: timeline, isLoading } = useQuery(
        ['timeline', { id }],
        (key, { id }) => getUserTimeline(id),
        { enabled: !!id }
    )

    const recentTasks: Timeline[] = recentTaskFilter(timeline)

    return (
        <>
            <Head>
                <title>{user?.username}</title>
                <meta
                    name="viewport"
                    content="initial-scale=1.0, width=device-width"
                />
            </Head>
            <PageHeader>
                <HomeContainer>
                    <HeaderContainer>
                        <TitleContainer>
                            <PageTitle
                                avatarUrl={user?.big_photo ?? 'placeholder.png'}
                                title={user?.full_name ?? ''}
                                description={user?.email}
                                actions={
                                    <>
                                        <ActionContainer>
                                            <Button onClick={toggleModal}>
                                                New Project
                                            </Button>
                                        </ActionContainer>
                                        <ActionContainer>
                                            <Link
                                                href={`/users/${user?.id}/settings`}
                                            >
                                                <Button
                                                    icon={<SettingOutlined />}
                                                >
                                                    Settings
                                                </Button>
                                            </Link>
                                        </ActionContainer>
                                    </>
                                }
                            />
                        </TitleContainer>
                    </HeaderContainer>
                </HomeContainer>
            </PageHeader>
            <PageBody>
                <Container>
                    <Projects userId={user?.id} />
                    <InnerContainer>
                        <LimitedActivity
                            title="Your activity"
                            activity={timeline ?? []}
                            isLoading={isLoading}
                            href={`/activity`}
                        />
                        <RecentTasks
                            limit={5}
                            title="Your work"
                            timeline={recentTasks}
                        />
                    </InnerContainer>
                </Container>
            </PageBody>
            <ProjectCreationModal toggle={toggleModal} open={isModalOpen} />
        </>
    )
}
