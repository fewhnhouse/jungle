import styled from 'styled-components'
import Link, { LinkProps } from 'next/link'
import { useScrollPosition } from '../util/useScrollPosition'
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
`

const StyledInputGroup = styled(InputGroup)`
    margin: 0px 5px;
`

const StyledButton = styled(Button)`
    margin: 0px 5px;
    padding: 5px;
`

const ProfileBadge = styled.img`
    border-radius: 50%;
    width: 40px;
    height: 40px;
    margin: 0px 5px;
    cursor: pointer;
    transition: box-shadow 0.3s ease-in-out;
    &:hover {
        box-shadow: rgba(0, 0, 0, 0.5) 0px 0px 15px 0px;
    }
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
    const [open, setOpen] = useState(false)
    const toggle = () => setOpen((open) => !open)
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
                <StyledButton theme="light">
                    <NotificationsIcon />
                </StyledButton>
                <Dropdown open={open} toggle={toggle}>
                    <ProfileBadge src="/bmo.png" onClick={toggle} />
                    <DropdownMenu right>
                        <DropdownItem>Action</DropdownItem>
                        <DropdownItem>Another action</DropdownItem>
                        <DropdownItem>Something else here</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </Options>
        </StyledHeader>
    )
}

export default Header
