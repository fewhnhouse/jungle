import styled from 'styled-components'
import Flex from './Flex'

const Menu = styled.nav`
    display: flex;
    flex-direction: column;
    margin: 20px 0px;
    width: 300px;
`

const MenuItem = styled.button<{ active?: boolean }>`
    border: none;
    text-align: left;
    background: none;
    color: #555;
    font-weight: ${({ active }) => (active ? 'bold' : 'normal')};
    padding: 10px;
    &:hover {
        color: #333;
    }
`

const Content = styled.div`
    margin: 20px 20px;
    margin-left: 40px;
    min-width: 500px;
`

const StyledFlex = styled(Flex)`
    width: min-content;
    margin: auto;
`

interface Props {
    menuItems: string[]
    children: React.ReactNode
    onMenuItemClick: (index: number) => () => void
    menuIndex: number
}

const Settings = ({
    menuItems,
    children,
    onMenuItemClick,
    menuIndex,
}: Props) => {
    return (
        <StyledFlex justify="flex-start">
            <Menu>
                {menuItems.map((tab, index) => (
                    <MenuItem
                        onClick={onMenuItemClick(index)}
                        key={index}
                        active={index === menuIndex}
                    >
                        {tab}
                    </MenuItem>
                ))}
            </Menu>
            <Content>{children}</Content>
        </StyledFlex>
    )
}

export default Settings
