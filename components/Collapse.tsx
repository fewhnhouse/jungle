import ExpandLessIcon from '@material-ui/icons/ExpandLess'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import styled from 'styled-components'
import { useState } from 'react'
import { Collapse } from 'react-collapse'

const StoryHeader = styled.div`
    height: 30px;
    margin: ${({ theme }) => `${theme.spacing.mini} ${theme.spacing.small}`};
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 0px ${({ theme }) => `${theme.spacing.small}`};
    background-color: ${({ theme }) => theme.colors.grey.light};
    border-radius: 4px;
    transition: background-color 0.2s ease;
    cursor: pointer;
    &:hover,
    &:active {
        background-color: ${({ theme }) => theme.colors.grey.normal};
    }
`

const StoryTitle = styled.h6`
    margin: 0;
    padding: 0px ${({ theme }) => `${theme.spacing.small}`};
`

interface CollapseProps {
    children: React.ReactNode
    title: string | React.ReactNode
}
export default function CustomCollapse({ children, title }: CollapseProps) {
    const [expanded, setExpanded] = useState(true)
    const toggleVisibility = () => setExpanded((expanded) => !expanded)

    return (
        <>
            <StoryHeader onClick={toggleVisibility}>
                {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                <StoryTitle>{title}</StoryTitle>
            </StoryHeader>
            <Collapse isOpened={expanded}>{children}</Collapse>
        </>
    )
}
