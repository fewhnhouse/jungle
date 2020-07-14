import styled from 'styled-components'
import ProjectCard from '../../components/home/ProjectCard'
import ActivityCard from '../../components/home/ActivityCard'
import IssueCard from '../../components/home/IssueCard'

const Container = styled.div`
    margin: 10px;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    height: 100%;
    align-items: center;
`

export default function Home() {
    return (
        <Container>
            <ProjectCard />
            <IssueCard />
            <ActivityCard />
        </Container>
    )
}
