import { Card, CardFooter, Button, Badge } from 'shards-react'
import styled from 'styled-components'
import useMedia from 'use-media'

const StyledButton = styled(Button)`
    margin: 0px 5px;
`

const StyledCard = styled(Card)`
    min-width: 300px;
    max-width: 500px;
    width: 100%;
    margin: 10px;
`

const StyledFooter = styled(CardFooter)`
    padding: 10px;
    display: flex;
    justify-content: flex-end;
`

const StyledImage = styled.img`
    border-radius: 50%;
    width: 30px;
    height: 30px;
    margin: 0px 5px;
`

const ProjectName = styled.span`
    margin: 0px 5px;
`

const ItemContainer = styled.div`
    display: flex;
    padding: 20px;
    justify-content: space-between;
    align-items: flex-start;
    flex-direction: column;
    &:hover > #link-buttons {
        opacity: 1;
    }
`

const StyledBadge = styled(Badge)`
    margin: 0px 5px;
`

const InfoContainer = styled.div`
    margin: 10px 0px;
`

export default function ProjectListItem() {
    const isMobile = useMedia({ maxWidth: '400px' })

    return (
        <StyledCard>
            <ItemContainer>
                <InfoContainer>
                    <StyledImage src="bmo.png" />
                    <ProjectName>Project 1</ProjectName>
                </InfoContainer>
                <div>
                    <StyledBadge id="issues-todo" outline>
                        {!isMobile && 'To Do: '}16
                    </StyledBadge>
                    <StyledBadge id="issues-in-progress" outline theme="dark">
                        {!isMobile && 'In Progress: '} 32
                    </StyledBadge>
                </div>
            </ItemContainer>

            <StyledFooter>
                <StyledButton id="dashboard" theme="dark" outline>
                    Backlog &rarr;
                </StyledButton>

                <StyledButton id="board" theme="dark" outline>
                    Board &rarr;
                </StyledButton>
            </StyledFooter>
        </StyledCard>
    )
}
