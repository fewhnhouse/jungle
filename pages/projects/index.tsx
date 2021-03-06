import { PageBody, PageHeader } from '../../components/Layout'
import PageTitle from '../../components/PageTitle'
import { QueryCache, useQuery } from 'react-query'
import { getProjects } from '../../taiga-api/projects'
import ProjectCard from '../../components/home/ProjectCard'
import Flex from '../../components/Flex'
import { Button, Skeleton } from 'antd'
import ProjectCreationModal from '../../components/home/ProjectCreationModal'
import { useState } from 'react'
import Head from 'next/head'
import { GetStaticProps } from 'next'
import { dehydrate } from 'react-query/hydration'

export const getStaticProps: GetStaticProps = async () => {
    const queryCache = new QueryCache()

    await queryCache.prefetchQuery(['projects'], () => getProjects())

    return {
        props: {
            dehydratedState: dehydrate(queryCache),
        },
        revalidate: 10,
    }
}

const Projects = () => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const { data, isLoading } = useQuery('projects', () => {
        return getProjects()
    })

    const toggleModal = () => setIsModalOpen((open) => !open)
    return (
        <>
            <Head>
                <title>Projects</title>
                <meta
                    name="viewport"
                    content="initial-scale=1.0, width=device-width"
                />
            </Head>
            <PageHeader>
                <PageTitle
                    title="Projects"
                    description="All your projects are listed here, aswell as publicly available projects."
                    actions={
                        <>
                            <Button onClick={toggleModal}>
                                Create Project
                            </Button>
                        </>
                    }
                />
            </PageHeader>
            <PageBody>
                <Flex wrap align="center" justify="center">
                    {isLoading && <Skeleton avatar active paragraph />}
                    {data?.map(
                        ({
                            id,
                            name,
                            description,
                            logo_small_url,
                            members,
                            is_private,
                            total_fans,
                            total_watchers,
                            is_fan,
                            is_watcher,
                        }) => (
                            <ProjectCard
                                members={members}
                                avatar={logo_small_url}
                                key={id}
                                id={id}
                                name={name}
                                description={description}
                                isPrivate={is_private}
                                fans={total_fans}
                                watchers={total_watchers}
                                isFan={is_fan}
                                isWatcher={is_watcher}
                            />
                        )
                    )}
                </Flex>
            </PageBody>
            <ProjectCreationModal toggle={toggleModal} open={isModalOpen} />
        </>
    )
}

export default Projects
