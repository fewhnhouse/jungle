import ProjectListItem from './ProjectListItem'
import styled from 'styled-components'
import { useQuery } from 'react-query'
import { getProjects } from '../../taiga-api/projects'
import Link from 'next/link'
import { Skeleton } from 'antd'

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 1;
    top: -120px;
    margin-right: ${({ theme }) => `${theme.spacing.crazy}`};
    position: relative;
    @media screen and (max-width: 960px) {
        margin-right: 0px;
    }
`

export default function Projects() {
    const { data, error, isLoading } = useQuery('projects', async () => {
        return getProjects()
    })

    const isMax = data?.length >= 6

    if (error) {
        localStorage.removeItem('user')
    }

    return (
        <Container>
            {isLoading && <Skeleton active paragraph={{ rows: 5 }} />}
            {data
                ?.sort(
                    (a, b) =>
                        new Date(b.modified_date).getTime() -
                        new Date(a.modified_date).getTime()
                )
                .filter((_, index) => index < 6)
                .map(({ id, name, description, logo_small_url, members }) => (
                    <ProjectListItem
                        members={members}
                        avatar={logo_small_url}
                        key={id}
                        id={id}
                        name={name}
                        description={description}
                    />
                ))}
            {isMax && (
                <Link href="/projects">
                    <a>See all Projects</a>
                </Link>
            )}
        </Container>
    )
}
