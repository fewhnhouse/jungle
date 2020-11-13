import { PageBody, PageHeader } from '../../components/Layout'
import PageTitle from '../../components/PageTitle'
import { useQuery } from 'react-query'
import { getProjects } from '../../taiga-api/projects'
import ProjectListItem from '../../components/home/ProjectListItem'
import Flex from '../../components/Flex'
import { Button, Skeleton } from 'antd'

const Projects = () => {
    const { data, isLoading, error } = useQuery('projects', () => {
        return getProjects()
    })
    if (error) {
        localStorage.removeItem('user')
    }
    return (
        <>
            <PageHeader>
                <PageTitle
                    title="Projects"
                    description="All your projects are listed here."
                />
                <Button>Create Project</Button>
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
                            <ProjectListItem
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
        </>
    )
}

export default Projects
