import ProjectListItem from './ProjectListItem'
import styled from 'styled-components'
import { useQuery } from 'react-query'
import authInstance from '../../util/axiosInstance'
import { Project } from '../../api/projects'

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 1;
    top: -80px;
    margin-right: ${({ theme }) => `${theme.spacing.crazy}`};
    position: relative;
    @media screen and (max-width: 400px) {
        margin-right: 0px;
    }
`

export default function Projects() {
    const { data, error } = useQuery('projects', async () => {
        const { data } = await authInstance.get<Project[]>('/projects')
        return data
    })
    if (error) {
        localStorage.removeItem('user')
    }

    return (
        <Container>
            {data?.map(({ id, name, description }) => (
                <ProjectListItem
                    key={id}
                    id={id}
                    name={name}
                    description={description}
                />
            ))}
        </Container>
    )
}
