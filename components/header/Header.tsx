import styled from 'styled-components'
import Link, { LinkProps } from 'next/link'
import { useScrollPosition } from '../../util/useScrollPosition'
import { FormInput, InputGroup } from 'shards-react'
import Notifications from './Notifications'
import Profile from './Profile'
import { useRouter } from 'next/router'
import { useState } from 'react'

interface HeaderProps {
    landing: boolean
    scrolled: boolean
}
const StyledHeader = styled.header<HeaderProps>`
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
    box-shadow: ${({ scrolled }) =>
        scrolled ? 'rgba(0, 0, 0, 0.5) 0px 0px 15px 0px' : ''};
    transition: box-shadow 0.3s ease-in-out;
`

const StyledLink = styled.a`
    padding: ${({ theme }) => `${theme.spacing.small}`};
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

const InputContainer = styled.div`
    position: absolute;
    right: 120px;
    top: 10px;
    transition: width 0.2s ease-in-out, height 0.2s ease-in-out,
        box-shadow 0.2s ease-in-out;
    width: ${({ opened }: { opened: boolean }) =>
        opened ? window.innerWidth - 240 + 'px' : '200px'};
    height: ${({ opened }: { opened: boolean }) => (opened ? '300px' : '40px')};
    background: white;
    border-radius: 6px;
    box-shadow: ${({ opened }: { opened: boolean }) =>
        opened ? 'rgba(0,0,0,0.5) 0px 0px 15px 0px' : ''};
`

const StyledInputGroup = styled(InputGroup)``

const WrappedLink = ({
    children,
    ...rest
}: LinkProps & { children: React.ReactNode }) => (
    <Link {...rest}>
        <StyledLink>{children}</StyledLink>
    </Link>
)

const Header = () => {
    const router = useRouter()
    const { pathname, query } = router
    const { id } = query

    const [open, setOpen] = useState(false)

    const onFocus = () => setOpen(true)
    const onBlur = () => setOpen(false)

    const { y } = useScrollPosition()
    return (
        <StyledHeader landing={pathname === '/'} scrolled={y > 0}>
            {pathname.includes('/projects/') ? (
                <Links>
                    <WrappedLink href="/home">Home</WrappedLink>
                    <WrappedLink
                        href="/projects/[id]/board"
                        as={`/projects/${id}/board`}
                    >
                        Board
                    </WrappedLink>
                    <WrappedLink
                        href="/projects/[id]/backlog"
                        as={`/projects/${id}/backlog`}
                    >
                        Backlog
                    </WrappedLink>
                    <WrappedLink
                        href="/projects/[id]/reports"
                        as={`/projects/${id}/reports`}
                    >
                        Reports
                    </WrappedLink>
                </Links>
            ) : pathname === '/login' ? (
                <h3></h3>
            ) : pathname.includes('/') ? (
                <Links>
                    <WrappedLink href="/">Home</WrappedLink>
                    <WrappedLink href="/projects">Projects</WrappedLink>
                    <WrappedLink href="/activity">Activity</WrappedLink>
                    <WrappedLink href="/your-work">Your Work</WrappedLink>
                </Links>
            ) : null}

            <Options>
                <InputContainer opened={open}>
                    <StyledInputGroup>
                        <FormInput
                            onFocus={onFocus}
                            onBlur={onBlur}
                            placeholder="Search..."
                        />
                    </StyledInputGroup>
                </InputContainer>
                <Notifications />
                <Profile />
            </Options>
        </StyledHeader>
    )
}

export default Header
