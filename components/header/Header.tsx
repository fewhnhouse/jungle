import styled from 'styled-components'
import { LinkProps } from 'next/link'
import { useScrollPosition } from '../../util/useScrollPosition'
import Notifications from './Notifications'
import Profile from './Profile'
import { useRouter } from 'next/router'
import { useState, useRef } from 'react'
import useMedia from 'use-media'
import { Input, Button } from 'rsuite'
import WorkOutlineIcon from '@material-ui/icons/WorkOutline'
import AppsIcon from '@material-ui/icons/Apps'
import HomeIcon from '@material-ui/icons/Home'
import SyncIcon from '@material-ui/icons/Sync'
import DashboardIcon from '@material-ui/icons/Dashboard'
import HistoryIcon from '@material-ui/icons/History'
import AssessmentIcon from '@material-ui/icons/Assessment'

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
    z-index: 1000;
`

const Links = styled.div`
    display: flex;
`

const Options = styled.div`
    display: flex;
    align-items: center;
`

const InputContainer = styled.div<{ opened: boolean; headerWidth?: number }>`
    position: relative;
    right: 20px;
    top: 0px;
    transition: width 0.2s ease-in-out, height 0.2s ease-in-out,
        box-shadow 0.2s ease-in-out;
    width: ${({ opened, headerWidth }) =>
        opened ? (headerWidth ?? 400) / 2 + 'px' : '200px'};
    background: white;
    border-radius: 6px;
    box-shadow: ${({ opened }: { opened: boolean }) =>
        opened ? 'rgba(0,0,0,0.5) 0px 0px 15px 0px' : ''};
    padding: ${({ theme }) => theme.spacing.mini};
`

const StyledLinkButton = styled(Button)`
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0px 10px;
    color: ${({ isCurrent }: { isCurrent: boolean }) =>
        isCurrent ? '#2589f5' : ''};
`

const IconWrapper = styled.div`
    margin: 0px 10px;
    display: flex;
    align-items: center;
`

const WrappedLink = ({
    children,
    href,
    as,
}: LinkProps & { children: React.ReactNode }) => {
    const { push, pathname } = useRouter()
    return (
        <StyledLinkButton
            isCurrent={pathname === href}
            onClick={() => push(href, as)}
        >
            {children}
        </StyledLinkButton>
    )
}

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
                            <WrappedLink href="/">
                                <IconWrapper>
                                    <HomeIcon />
                                </IconWrapper>
                                Home
                            </WrappedLink>
                            <WrappedLink
                                href="/projects/[id]/board"
                                as={`/projects/${id}/board`}
                            >
                                <IconWrapper>
                                    <DashboardIcon />
                                </IconWrapper>
                                Board
                            </WrappedLink>
                            <WrappedLink
                                href="/projects/[id]/backlog"
                                as={`/projects/${id}/backlog`}
                            >
                                <IconWrapper>
                                    <HistoryIcon />
                                </IconWrapper>
                                Backlog
                            </WrappedLink>
                            <WrappedLink
                                href="/projects/[id]/reports"
                                as={`/projects/${id}/reports`}
                            >
                                <IconWrapper>
                                    <AssessmentIcon />
                                </IconWrapper>
                                Reports
                            </WrappedLink>
                        </Links>
                    ) : pathname === '/login' ? (
                        <h3></h3>
                    ) : pathname.includes('/') ? (
                        <Links>
                            <WrappedLink href="/">
                                <IconWrapper>
                                    <HomeIcon />
                                </IconWrapper>
                                Home
                            </WrappedLink>
                            <WrappedLink href="/projects">
                                <IconWrapper>
                                    <AppsIcon />
                                </IconWrapper>
                                Projects
                            </WrappedLink>
                            <WrappedLink href="/activity">
                                <IconWrapper>
                                    <SyncIcon />
                                </IconWrapper>
                                Activity
                            </WrappedLink>
                            <WrappedLink href="/your-work">
                                <IconWrapper>
                                    <WorkOutlineIcon />
                                </IconWrapper>
                                Your Work
                            </WrappedLink>
                        </Links>
                    ) : null}

                    <Options>
                        <InputContainer
                            headerWidth={
                                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                // @ts-ignore
                                (ref?.current?.clientWidth ?? 400) as number
                            }
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
