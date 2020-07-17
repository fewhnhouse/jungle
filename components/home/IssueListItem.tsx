import { Badge } from 'shards-react'
import styled from 'styled-components'
import ListItem from '../ListItem'

const IssueName = styled.span`
    margin: 0px ${({ theme }) => `${theme.spacing.small}`};
`

const ItemContainer = styled.div`
    display: flex;
    padding: ${({ theme }) => `${theme.spacing.small}`};;
    justify-content: space-between;
    align-items: center;
    &:hover > #link-buttons {
        opacity: 1;
    }
`

const StyledBadge = styled(Badge)`
    margin: 0px ${({ theme }) => `${theme.spacing.mini}`};;
`

export default function IssueListItem() {

    return (
        <ListItem>
            <ItemContainer>
                <div>
                    <IssueName>Issue 1</IssueName>
                </div>
                <div>
                    <StyledBadge id="issues-todo" outline>
                        To Do
                    </StyledBadge>
                </div>
            </ItemContainer>
        </ListItem>
    )
}
