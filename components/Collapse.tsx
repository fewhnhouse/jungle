import styled from 'styled-components'
import { useState } from 'react'
import { Collapse } from 'react-collapse'
import { Button, Divider, Dropdown, Menu, Tag } from 'antd'
import { DownOutlined, EllipsisOutlined, UpOutlined } from '@ant-design/icons'

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
    flex: 1;
    min-width: 0;
    flex-direction: column;
    align-items: flex-start;
    padding: ${({ theme }) => `${theme.spacing.small}`};
    &:nth-child(2) {
        padding-left: 0px;
    }
`

const Description = styled.span`
    font-size: ${({ theme }) => theme.fontSize.xs};
    color: ${({ theme }) => theme.colors.darkgrey.normal};
`

const InnerContainer = styled.div`
    min-width: 0;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
`

const StoryTitle = styled.h3`
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin: 0;
`

const StyledTag = styled(Tag)`
    margin: 0;
    margin-right: 5px;
`

interface CollapseProps {
    children: React.ReactNode
    title: string | React.ReactNode
    primaryAction?: React.ReactNode
    description?: string
    actions?: { title: string; action: () => void }[]
    status: 'default' | 'active' | 'closed'
}
export default function CustomCollapse({
    children,
    title,
    description,
    primaryAction,
    actions,
    status = 'default',
}: CollapseProps) {
    const [expanded, setExpanded] = useState(status !== 'closed')
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
                    <Button
                        style={{ marginRight: 5 }}
                        icon={expanded ? <UpOutlined /> : <DownOutlined />}
                    />

                    <HeaderContainer>
                        <StoryTitle>{title}</StoryTitle>
                        <Description>
                            {status === 'active' && (
                                <StyledTag color="blue">Active</StyledTag>
                            )}
                            {status === 'closed' && (
                                <StyledTag color="grey">Closed</StyledTag>
                            )}
                            {description}
                        </Description>
                    </HeaderContainer>
                </InnerContainer>
                {primaryAction}
                {primaryAction && <Divider type="vertical" />}
                {actions && (
                    <Dropdown trigger={['click']} overlay={menu}>
                        <Button
                            style={{ minWidth: 32 }}
                            icon={<EllipsisOutlined />}
                        />
                    </Dropdown>
                )}
            </StoryHeader>
            <Collapse isOpened={expanded}>{children}</Collapse>
        </>
    )
}
