import styled from 'styled-components'
import ListItem from '../ListItem'
import { Tag } from 'rsuite'

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
    return (
        <ListItem>
            <ItemContainer>
                <Content>
                    <Tag id="issues-todo">{type}</Tag>
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
