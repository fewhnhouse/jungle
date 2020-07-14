import ProjectListItem from '../../components/home/ProjectListItem'
import {
    StyledCard,
    List,
    ScrollableCardBody,
    StyledFooter,
    StyledButton,
} from './shared'
import { CardHeader } from 'shards-react'

export default function ProjectCard() {
    return (
        <StyledCard>
            <CardHeader>Projects</CardHeader>
            <ScrollableCardBody>
                <List>
                    <ProjectListItem />
                    <ProjectListItem />
                    <ProjectListItem />
                    <ProjectListItem />
                    <ProjectListItem />
                </List>
            </ScrollableCardBody>
            <StyledFooter>
                <StyledButton outline>Create &rarr;</StyledButton>
                <StyledButton outline theme="dark">
                    See all &rarr;
                </StyledButton>
            </StyledFooter>
        </StyledCard>
    )
}
