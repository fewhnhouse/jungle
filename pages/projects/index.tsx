import styled from 'styled-components'
import Link from 'next/link'
import { Button, Panel } from 'rsuite'
import { PageBody, PageHeader } from '../../components/Layout'
import PageTitle from '../../components/PageTitle'
import { useQuery } from 'react-query'
import { getProjects } from '../../taiga-api/projects'
import ProjectListItem from '../../components/home/ProjectListItem'
import Flex from '../../components/Flex'

const Container = styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
`

const StyledPanel = styled(Panel)`
    margin: 8px 16px;
    background: white;
`

const Projects = () => {
    const { data, error } = useQuery('projects', () => {
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
                    {data?.map(({ id, name, description }) => (
                        <ProjectListItem
                            key={id}
                            id={id}
                            name={name}
                            description={description}
                        />
                    ))}
                </Flex>
            </PageBody>
        </>
    )
}

export default Projects
