import styled from 'styled-components'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { PageBody, PageHeader } from '../../../components/Layout'
import PageTitle from '../../../components/PageTitle'
import { QueryCache, useQuery } from 'react-query'
import { getProject, getProjects } from '../../../taiga-api/projects'
import { getProjectTimeline, Timeline } from '../../../taiga-api/timelines'
import Flex from '../../../components/Flex'
import { Button } from 'antd'
import LevelDisplay from '../../../components/LevelDisplay/LevelDisplay'
import Actions from '../../../components/project/Actions'
import Achievements from '../../../components/achievements/Achievements'
import LimitedActivity from '../../../components/activity/LimitedActivity'
import useMedia from 'use-media'
import { recentTaskFilter } from '../../../util/recentTaskFilter'
import LimitedYourWork from '../../../components/your-work/LimitedYourWork'
import Head from 'next/head'
import { GetStaticProps } from 'next'
import { dehydrate } from 'react-query/hydration'
import MemberButton from '../../../components/MemberButton'

const StyledFlex = styled(Flex)`
    margin-top: 20px;
`

const TimelineContainer = styled.div`
    width: 100%;
    margin: 0px 20px;
    &:first-child {
        margin-right: 20px;
    }
    &:last-child {
        margin-left: 20px;
    }
`

const StyledButton = styled(Button)`
    width: 130px;
    &:first-child {
        margin-left: 0px;
    }
    margin: 0px 2.5px;
    &:last-child {
        margin-right: 0px;
    }
`

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

    return {
        props: {
            dehydratedState: dehydrate(queryCache),
        },
        revalidate: 10,
    }
}

const Project = () => {
    const router = useRouter()
    const { projectId } = router.query
    const isMobile = useMedia('(max-width: 960px)')
    const { data } = useQuery(
        ['project', { projectId }],
        (key, { projectId }) => getProject(projectId as string),
        {
            enabled: !!projectId,
        }
    )

    const { data: timeline } = useQuery(
        ['projectTimeline', { projectId }],
        (key, { projectId }) => getProjectTimeline(projectId),
        {
            enabled: !!projectId,
        }
    )
    // Get all tasks which are less than 24h old, related to tasks / userstories, unique and max of 10
    const recentTasks: Timeline[] = recentTaskFilter(timeline)

    return (
        <div>
            <Head>
                <title>{data?.name}</title>
                <meta
                    name="viewport"
                    content="initial-scale=1.0, width=device-width"
                />
            </Head>

            <PageHeader>
                <div>
                    <Flex direction="column" align="flex-start">
                        <PageTitle
                            breadcrumbs={[
                                { href: `/projects`, label: 'Projects' },
                                {
                                    href: `/projects/${projectId}`,
                                    label: data?.name,
                                },
                            ]}
                            avatarUrl={
                                data?.logo_big_url ?? '/placeholder.webp'
                            }
                            title={data?.name}
                            description={
                                <Flex direction="column">
                                    <p>{data?.description}</p>
                                    <Flex>
                                        {data?.members.map((member) => (
                                            <MemberButton
                                                key={member.id}
                                                member={member}
                                            />
                                        ))}
                                    </Flex>
                                </Flex>
                            }
                            actions={data && <Actions project={data} />}
                        />
                        <LevelDisplay />
                    </Flex>
                    <Achievements />
                    <StyledFlex justify="flex-end">
                        <Flex>
                            <Link href={`/projects/${projectId}/board`}>
                                <StyledButton size="large">
                                    Board &rarr;
                                </StyledButton>
                            </Link>
                            <Link href={`/projects/${projectId}/backlog`}>
                                <StyledButton size="large">
                                    Backlog &rarr;
                                </StyledButton>
                            </Link>
                        </Flex>
                    </StyledFlex>
                </div>
            </PageHeader>
            <PageBody>
                <Flex
                    align={isMobile ? 'center' : 'flex-start'}
                    justify="space-between"
                    direction={isMobile ? 'column' : 'row'}
                >
                    <TimelineContainer>
                        <LimitedActivity
                            title="Project Activity"
                            limit={5}
                            activity={timeline}
                            href={`/projects/${projectId}/activity`}
                        />
                    </TimelineContainer>
                    <TimelineContainer>
                        <LimitedYourWork
                            limit={5}
                            title="Recent Tasks"
                            timeline={recentTasks}
                            href={`/projects/${projectId}/your-work`}
                        />
                    </TimelineContainer>
                </Flex>
            </PageBody>
        </div>
    )
}

export default Project
