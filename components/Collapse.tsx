import ExpandLessIcon from '@material-ui/icons/ExpandLess'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import MoreHorizIcon from '@material-ui/icons/MoreHoriz'
import styled from 'styled-components'
import { useState } from 'react'
import { Collapse } from 'react-collapse'
import { Dropdown, Menu } from 'antd'

const StoryHeader = styled.div`
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

const HeaderContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: ${({ theme }) => `${theme.spacing.small}`};
`

const Description = styled.span`
    font-size: ${({ theme }) => theme.fontSize.xs};
    color: ${({ theme }) => theme.colors.darkgrey.normal};
`

const InnerContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
`

const StoryTitle = styled.h3`
    margin: 0;
`

interface CollapseProps {
    children: React.ReactNode
    title: string | React.ReactNode
    description?: string
    actions?: { title: string; action: () => void }[]
}
export default function CustomCollapse({
    children,
    title,
    description,
    actions,
}: CollapseProps) {
    const [expanded, setExpanded] = useState(true)
    const toggleVisibility = () => setExpanded((expanded) => !expanded)

    const menu = (
        <Menu>
            {actions?.map(({ action, title }, index) => (
                <Menu.Item key={index} onClick={action}>
                    {title}
                </Menu.Item>
            ))}
        </Menu>
    )
    return (
        <>
            <StoryHeader>
                <InnerContainer onClick={toggleVisibility}>
                    {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    <HeaderContainer>
                        <StoryTitle>{title}</StoryTitle>
                        <Description>{description}</Description>
                    </HeaderContainer>
                </InnerContainer>
                {actions && (
                    <Dropdown trigger={['click']} overlay={menu}>
                        <MoreHorizIcon />
                    </Dropdown>
                )}
            </StoryHeader>
            <Collapse isOpened={expanded}>{children}</Collapse>
        </>
    )
}
