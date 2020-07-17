import ProjectListItem from '../../components/home/ProjectListItem'
import styled from 'styled-components'

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 1;
    top: -80px;
    margin-right: 60px;
    position: relative;
    @media screen and (max-width: 400px) {
        margin-right: 0px;
    }
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
