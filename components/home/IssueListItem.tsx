import DashboardIcon from '@material-ui/icons/Dashboard'
import ListIcon from '@material-ui/icons/List'
import { Button, Badge, Tooltip } from 'shards-react'
import styled from 'styled-components'
import ListItem from '../ListItem'
import useMedia from 'use-media'

const StyledIconButton = styled(Button)`
    margin: 0px 5px;
    padding: 5px;
`

const StyledImage = styled.img`
    border-radius: 50%;
    width: 30px;
    height: 30px;
    margin: 0px 5px;
`

const IssueName = styled.span`
    margin: 0px 5px;
`

const ItemContainer = styled.div`
    display: flex;
    padding: 10px;
    justify-content: space-between;
    align-items: center;
    &:hover > #link-buttons {
        opacity: 1;
    }
`

const StyledBadge = styled(Badge)`
    margin: 0px 5px;
`

const LinkButtonContainer = styled.div`
    transition: opacity 0.3s ease-in-out;
    opacity: 0;
`

export default function IssueListItem() {
    const isMobile = useMedia({ maxWidth: '400px' })

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
