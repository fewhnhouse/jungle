import { CardHeader, CardBody, CardTitle } from 'shards-react'
import { StyledCard, StyledFooter, StyledButton } from './shared'

export default function ActivityCard() {
    return (
        <StyledCard>
            <CardHeader>Activity</CardHeader>
            <CardBody>
                <CardTitle>Lorem Ipsum</CardTitle>
                <p>Lorem ipsum dolor sit amet.</p>
            </CardBody>
            <StyledFooter>
                <StyledButton outline theme="dark">
                    See all &rarr;
                </StyledButton>
            </StyledFooter>
        </StyledCard>
    )
}
