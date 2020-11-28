import styled from 'styled-components'
import Projects from '../components/home/Projects'
import { useState } from 'react'
import ProjectCreationModal from '../components/home/ProjectCreationModal'
import { getMe } from '../taiga-api/users'
import PageTitle from '../components/PageTitle'
import { PageBody, PageHeader } from '../components/Layout'
import { useQuery } from 'react-query'
import { Button } from 'antd'
import { SettingOutlined } from '@ant-design/icons'
import Link from 'next/link'
import { ActionContainer } from '../components/project/Actions'
import LimitedActivity from '../components/activity/LimitedActivity'
import { getUserTimeline, Timeline } from '../taiga-api/timelines'
import { GetStaticProps, InferGetStaticPropsType } from 'next'
import { getPublicProjects } from '../taiga-api/projects'
import { recentTaskFilter } from '../util/recentTaskFilter'
import LimitedYourWork from '../components/your-work/LimitedYourWork'
import Head from 'next/head'
import { QueryCache } from 'react-query'
import { dehydrate } from 'react-query/hydration'

const Container = styled.div`
    padding: ${({ theme }) => `${theme.spacing.huge} ${theme.spacing.crazy}`};
    margin: auto;
    max-width: 1400px;
    display: flex;
    flex-wrap: wrap;
    height: 100%;
    align-items: flex-start;
    @media screen and (max-width: 960px) {
        flex-direction: column;
        align-items: center;
    }
    @media screen and (max-width: 720px) {
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
    width: 100%;
`

const TitleContainer = styled.div`
    display: flex;
    flex: 3;
    flex-direction: column;
    margin-right: ${({ theme }) => theme.spacing.medium};
`

export const getStaticProps: GetStaticProps = async (context) => {
    const queryCache = new QueryCache()

    await queryCache.prefetchQuery('projects', () => getPublicProjects())

    return {
        props: {
            dehydratedState: dehydrate(queryCache),
        },
        revalidate: 10,
    }
}

export default function Home({
    publicProjects,
}: InferGetStaticPropsType<typeof getStaticProps>) {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const toggleModal = () => {
        setIsModalOpen((open) => !open)
    }

    const { data: me } = useQuery('me', () => getMe())

    const { data: timeline, isLoading } = useQuery(
        ['timeline', { id: me?.id }],
        (key, { id }) => getUserTimeline(id),
        { enabled: !!me?.id }
    )

    const recentTasks: Timeline[] = recentTaskFilter(timeline)

    return (
        <>
            <Head>
                <title>Home</title>
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
                                avatarUrl={me?.big_photo ?? 'placeholder.png'}
                                title={me?.full_name ?? ''}
                                description={me?.email}
                                actions={
                                    <>
                                        <ActionContainer>
                                            <Button onClick={toggleModal}>
                                                New Project
                                            </Button>
                                        </ActionContainer>
                                        <ActionContainer>
                                            <Link
                                                href={`/users/${me?.id}/settings`}
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
                    <Projects publicProjects={publicProjects} />
                    <InnerContainer>
                        <LimitedActivity
                            limit={5}
                            title="Your recent activity"
                            activity={timeline ?? []}
                            isLoading={isLoading}
                            href="/activity"
                        />
                        <LimitedYourWork
                            limit={5}
                            title="Your recent work"
                            timeline={recentTasks}
                            isLoading={isLoading}
                            href="/your-work"
                        />
                    </InnerContainer>
                </Container>
            </PageBody>
            <ProjectCreationModal toggle={toggleModal} open={isModalOpen} />
        </>
    )
}
