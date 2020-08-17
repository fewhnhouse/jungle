import ExpandLessIcon from '@material-ui/icons/ExpandLess'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import MoreHorizIcon from '@material-ui/icons/MoreHoriz'
import styled from 'styled-components'
import { useState } from 'react'
import { Collapse } from 'react-collapse'
import { Dropdown, IconButton } from 'rsuite'

const StoryHeader = styled.div`
    height: 30px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    background-color: ${({ theme }) => theme.colors.grey.light};
    border-radius: 4px;
    padding: 0px ${({ theme }) => theme.spacing.small};
    transition: background-color 0.2s ease;
    margin: ${({ theme }) => `${theme.spacing.small} 0px`};
    cursor: pointer;
    &:hover,
    &:active {
        background-color: ${({ theme }) => theme.colors.grey.normal};
    }
`

const InnerContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
`

const StoryTitle = styled.h6`
    margin: 0;
    padding: 0px ${({ theme }) => `${theme.spacing.small}`};
`

interface CollapseProps {
    children: React.ReactNode
    title: string | React.ReactNode
    actions?: { title: string; action: () => void }[]
}
export default function CustomCollapse({
    children,
    title,
    actions,
}: CollapseProps) {
    const [expanded, setExpanded] = useState(true)
    const toggleVisibility = () => setExpanded((expanded) => !expanded)
    return (
        <>
            <StoryHeader>
                <InnerContainer onClick={toggleVisibility}>
                    {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    <StoryTitle>{title}</StoryTitle>
                </InnerContainer>
                {actions && (
                    <Dropdown
                        placement="bottomEnd"
                        renderTitle={() => <MoreHorizIcon />}
                    >
                        {actions.map(({ action, title }, index) => (
                            <Dropdown.Item key={index} onClick={action}>
                                {title}
                            </Dropdown.Item>
                        ))}
                    </Dropdown>
                )}
            </StoryHeader>
            <Collapse isOpened={expanded}>{children}</Collapse>
        </>
    )
}
