import IssueListItem from '../../components/home/IssueListItem'
import { CardHeader } from 'shards-react'
import {
    ScrollableCardBody,
    StyledCard,
    List,
    StyledButton,
    StyledFooter,
} from './shared'

export default function IssueCard() {
    return (
        <StyledCard>
            <CardHeader>Your Work</CardHeader>
            <ScrollableCardBody>
                <List>
                    <IssueListItem />
                    <IssueListItem />
                    <IssueListItem />
                    <IssueListItem />
                    <IssueListItem />
                    <IssueListItem />
                    <IssueListItem />
                </List>
            </ScrollableCardBody>
            <StyledFooter>
                <StyledButton outline theme="dark">
                    See all &rarr;
                </StyledButton>
            </StyledFooter>
        </StyledCard>
    )
}
