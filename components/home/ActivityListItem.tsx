import { Badge } from 'shards-react'
import styled from 'styled-components'
import ListItem from '../ListItem'


const IssueName = styled.span`
    margin: 0px 5px;
`

const ItemContainer = styled.div`
    display: flex;
    padding: 10px;
    min-width: 300px;
    justify-content: space-between;
    align-items: center;
    &:hover > #link-buttons {
        opacity: 1;
    }
`

const StyledBadge = styled(Badge)`
    margin: 0px 5px;
`


export default function ActivityListItem() {

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
