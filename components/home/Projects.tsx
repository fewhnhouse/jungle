import ProjectListItem from './ProjectListItem'
import styled from 'styled-components'
import { useQuery } from 'react-query'
import { getProjects } from '../../taiga-api/projects'
import Link from 'next/link'

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 1;
    top: -120px;
    margin-right: ${({ theme }) => `${theme.spacing.crazy}`};
    position: relative;
    @media screen and (max-width: 400px) {
        margin-right: 0px;
    }
`

export default function Projects() {
    const { data, error } = useQuery('projects', async () => {
        return getProjects()
    })

    const isMax = data?.length >= 6

    if (error) {
        localStorage.removeItem('user')
    }

    return (
        <Container>
            {data
                .sort(
                    (a, b) =>
                        new Date(b.modified_date).getTime() -
                        new Date(a.modified_date).getTime()
                )
                ?.filter((_, index) => index < 6)
                .map(({ id, name, description }) => (
                    <ProjectListItem
                        key={id}
                        id={id}
                        name={name}
                        description={description}
                    />
                ))}
            {isMax && <Link href="/projects">See all Projects</Link>}
        </Container>
    )
}
