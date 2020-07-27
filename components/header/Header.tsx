import styled from 'styled-components'
import Link, { LinkProps } from 'next/link'
import { useScrollPosition } from '../../util/useScrollPosition'
import Notifications from './Notifications'
import Profile from './Profile'
import { useRouter } from 'next/router'
import { useState, useRef } from 'react'
import useMedia from 'use-media'
import { Input } from 'rsuite'
import { useSpring, animated } from 'react-spring'

interface HeaderProps {
    landing: boolean
    scrolled: boolean
}
const StyledHeader = styled.header<HeaderProps>`
    height: 60px;
    padding: 0px 10px;
    border-radius: 8px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    background-color: white;
    z-index: 100;
    margin: 20px auto;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.25);
    transition: box-shadow 0.3s ease-in-out;
    min-width: 400px;
    width: 90%;
    max-width: 1000px;
`

const HeaderContainer = styled.div`
    height: 100px;
    width: 100%;
    position: fixed;
    top: 0px;
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
    position: relative;
    right: 20px;
    top: 0px;
    transition: width 0.2s ease-in-out, height 0.2s ease-in-out,
        box-shadow 0.2s ease-in-out;
    width: ${({
        opened,
        headerWidth,
    }: {
        opened: boolean
        headerWidth?: number
    }) => (opened ? (headerWidth ?? 400) / 2 + 'px' : '200px')};
    background: white;
    border-radius: 6px;
    box-shadow: ${({ opened }: { opened: boolean }) =>
        opened ? 'rgba(0,0,0,0.5) 0px 0px 15px 0px' : ''};
    padding: ${({ theme }) => theme.spacing.mini};
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
    const ref = useRef()
    console.log(ref.current)
    const router = useRouter()
    const isMobile = useMedia('screen and (max-width: 400px)')
    const { pathname, query } = router
    const { id } = query

    const [open, setOpen] = useState(false)

    const onFocus = () => setOpen(true)
    const onBlur = () => setOpen(false)

    const { y } = useScrollPosition()

    return (
        !isMobile && (
            <HeaderContainer>
                <StyledHeader
                    ref={ref}
                    landing={pathname === '/'}
                    scrolled={y > 0}
                >
                    {pathname.includes('/projects/') ? (
                        <Links>
                            <WrappedLink href="/">Home</WrappedLink>
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
                            <WrappedLink href="/your-work">
                                Your Work
                            </WrappedLink>
                        </Links>
                    ) : null}

                    <Options>
                        <InputContainer
                            headerWidth={ref?.current?.clientWidth}
                            opened={open}
                        >
                            <Input
                                onFocus={onFocus}
                                onBlur={onBlur}
                                placeholder="Search..."
                            />
                        </InputContainer>
                        <Notifications />
                        <Profile />
                    </Options>
                </StyledHeader>
            </HeaderContainer>
        )
    )
}

export default Header
