import { Badge } from 'shards-react'
import styled from 'styled-components'
import ListItem from '../ListItem'

const IssueName = styled.span`
    margin: 0px ${({ theme }) => `${theme.spacing.small}`};
`

const Description = styled.span`
    margin: 0px ${({ theme }) => `${theme.spacing.small}`};
`

const ItemContainer = styled.div`
    display: flex;
    padding: ${({ theme }) => `${theme.spacing.small}`};
    min-width: 300px;
    justify-content: space-between;
    align-items: center;
    &:hover > #link-buttons {
        opacity: 1;
    }
`

const StyledBadge = styled(Badge)`
    margin: 0px ${({ theme }) => `${theme.spacing.mini}`};
`

const Content = styled.div`
    display: flex;
    flex-direction: row;
`

export default function YourWorkItem() {
    return (
        <ListItem>
            <ItemContainer>
                <Content>
                    <IssueName>
                        <b>ID-1102</b>
                        <Description>Create Dashboard Overlay</Description>
                    </IssueName>
                    <StyledBadge id="issues-todo" outline>
                        To Do
                    </StyledBadge>
                </Content>
                <div>
                    <span>1d</span>
                </div>
            </ItemContainer>
        </ListItem>
    )
}
