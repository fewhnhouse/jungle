import ProjectListItem from '../../components/home/ProjectListItem'
import styled from 'styled-components'

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 2;
    top: -80px;
    position: relative;
`

export default function ProjectCard() {
    return (
        <Container>
            <ProjectListItem />
            <ProjectListItem />
            <ProjectListItem />
            <ProjectListItem />
            <ProjectListItem />
        </Container>
    )
}
