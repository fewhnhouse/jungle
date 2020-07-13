import styled from 'styled-components'
import Link, { LinkProps } from 'next/link'
import { useScrollPosition } from '../../util/useScrollPosition'
import {
    FormInput,
    InputGroup,
    InputGroupAddon,
    Button,
    Dropdown,
    DropdownMenu,
    DropdownItem,
} from 'shards-react'
import SearchIcon from '@material-ui/icons/Search'
import Notifications from './Notifications'
import Profile from './Profile'

import NotificationsIcon from '@material-ui/icons/Notifications'
import { useState } from 'react'

const StyledHeader = styled.header`
    height: 60px;
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    position: fixed;
    top: 0px;
    background-color: white;
    z-index: 100;
    box-shadow: ${({ scrolled }: { scrolled: boolean }) =>
        scrolled ? 'rgba(0, 0, 0, 0.5) 0px 0px 15px 0px' : ''};
    transition: box-shadow 0.3s ease-in-out;
`

const StyledLink = styled.a`
    padding: 10px;
    text-decoration: none;
    cursor: pointer;
`

const Links = styled.div`
    display: flex;
`

const Options = styled.div`
    display: flex;
    align-items: center;
`

const StyledInputGroup = styled(InputGroup)`
    margin: 0px 5px;
`


const WrappedLink = ({
    children,
    ...rest
}: LinkProps & { children: React.ReactNode }) => (
    <Link {...rest}>
        <StyledLink>{children}</StyledLink>
    </Link>
)

const Header = () => {
    const { y } = useScrollPosition()
    return (
        <StyledHeader scrolled={y > 0}>
            <Links>
                <WrappedLink href="/">Home</WrappedLink>
                <WrappedLink href="/your-work">Your work</WrappedLink>
                <WrappedLink href="/board">Board</WrappedLink>
                <WrappedLink href="/backlog">Backlog</WrappedLink>
                <WrappedLink href="/reports">Reports</WrappedLink>
            </Links>
            <Options>
                <StyledInputGroup>
                    <FormInput placeholder="Search..." />
                    <InputGroupAddon type="append">
                        <Button
                            style={{ padding: '5px 10px' }}
                            theme="secondary"
                        >
                            <SearchIcon />
                        </Button>
                    </InputGroupAddon>
                </StyledInputGroup>
                <Notifications/>
                <Profile/>
            </Options>
        </StyledHeader>
    )
}

export default Header
