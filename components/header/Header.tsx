import styled from 'styled-components'
import { LinkProps } from 'next/link'
import { useScrollPosition } from '../../util/useScrollPosition'
import Notifications from './Notifications'
import Profile from './Profile'
import { useRouter } from 'next/router'
import { useState, useRef } from 'react'
import useMedia from 'use-media'
import Tab from './Tab'
import { Button, Input } from 'antd'
import { AppstoreOutlined, BlockOutlined, HistoryOutlined, HomeOutlined } from '@ant-design/icons'

interface HeaderProps {
    landing: boolean
    scrolled: boolean
}
const StyledHeader = styled.header<HeaderProps>`
    padding: 10px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    background-color: white;
    z-index: 100;
    box-shadow: ${({ scrolled }) =>
        scrolled ? '0px 0px 10px rgba(0, 0, 0, 0.25)' : ''};
    transition: box-shadow 0.3s ease-in-out;
    width: 100%;
    position: fixed;
    z-index: 1000;
    top: 0px;
`

const Links = styled.div`
    display: flex;
    flex-direction: row;
    button {
        margin: 0px 10px;
    }
    @media screen and (max-width: 700px) {
        justify-content: space-between;
        width: 100%;
    }
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

const StyledLinkButton = styled(Button)<{ $isCurrent?: boolean }>`
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0px;
    color: ${({ $isCurrent }) => ($isCurrent ? '#2589f5' : '')};
`

export const WrappedLink = ({
    children,
    className,
    href,
    as,
}: LinkProps & { children: React.ReactNode; className?: string }) => {
    const { push, pathname } = useRouter()
    return (
        <StyledLinkButton
            className={className}
            $isCurrent={pathname === href}
            onClick={() => push(href, as)}
        >
            {children}
        </StyledLinkButton>
    )
}

const Header = () => {
    const ref = useRef()
    const router = useRouter()
    const isTablet = useMedia('screen and (max-width: 720px)')

    const { pathname } = router

    const [open, setOpen] = useState(false)

    const onFocus = () => setOpen(true)
    const onBlur = () => setOpen(false)

    const { y } = useScrollPosition()

    return (
        <StyledHeader ref={ref} landing={pathname === '/'} scrolled={y > 0}>
            {pathname === '/login' ? (
                <h3></h3>
            ) : pathname.includes('/') ? (
                <Links>
                    <Tab href="/" icon={<HomeOutlined />} label="Home" />
                    <Tab
                        href="/projects"
                        icon={<AppstoreOutlined />}
                        label="Projects"
                    />
                    <Tab
                        href="/activity"
                        icon={<HistoryOutlined />}
                        label="Activity"
                    />
                    <Tab
                        href="/your-work"
                        icon={<BlockOutlined />}
                        label="Your Work"
                    />
                </Links>
            ) : null}

            <Options>
                {false && (
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
                )}
                <Notifications />
                <Profile />
            </Options>
        </StyledHeader>
    )
}

export default Header
