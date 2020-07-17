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
    margin: 0px 4px;
    width: 60px;
    height: 26px;
`

const Content = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
`

interface Props {
    type: 'move' | 'create' | 'edit' | 'delete'
    issue: string
}
export default function ActivityListItem({ type, issue }: Props) {
    const getTheme = () => {
        switch (type) {
            case 'move':
                return 'primary'
            case 'create':
                return 'success'
            case 'delete':
                return 'danger'
            case 'edit':
                return 'info'
        }
    }
    return (
        <ListItem>
            <ItemContainer>
                <Content>
                    <StyledBadge id="issues-todo" outline theme={getTheme()}>
                        {type}
                    </StyledBadge>
                    <IssueName>
                        <Description>
                            You moved <b>{issue}</b> into review.
                        </Description>
                    </IssueName>
                </Content>
                <div>
                    <span>1d</span>
                </div>
            </ItemContainer>
        </ListItem>
    )
}
