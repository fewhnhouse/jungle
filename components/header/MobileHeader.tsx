import {
    AppstoreOutlined,
    BlockOutlined,
    HistoryOutlined,
    HomeOutlined,
    MenuOutlined,
} from '@ant-design/icons'
import { Avatar, Button, Skeleton } from 'antd'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { queryCache, useQuery } from 'react-query'
import styled from 'styled-components'
import { getMe } from '../../taiga-api/users'
import Flex from '../Flex'

const MenuButton = styled(Button)`
    margin-right: 5px;
`

const Description = styled.span`
    color: #555;
`

const Title = styled.h2`
    margin-bottom: 0;
`

const TitleContainer = styled(Flex)`
    margin-left: 20px;
`

const Menu = styled(Flex)<{ $expanded: boolean }>`
    position: absolute;
    transition: all 0.2s ease-in-out;
    pointer-events: ${({ $expanded }) => ($expanded ? '' : 'none')};
    opacity: ${({ $expanded }) => ($expanded ? '1' : '0')};
    height: ${({ $expanded }) => ($expanded ? 'calc(100vh - 50px)' : '0px')};
    width: 100vw;
    top: 50px;
    left: 0px;
    background: white;
    z-index: 100;
`

const Anchor = styled.a`
    width: calc(100% - 20px);
    padding: 10px 0px;
    border-bottom: 1px solid rgb(240, 240, 240);
    font-size: 16px;
    color: #333;
    margin: 0px 10px;
    svg {
        margin-right: 10px;
    }
`

const Profile = styled(Flex)`
    width: 100%;
    padding: 20px 10px;
    background: rgb(240, 240, 240);
    border-bottom: 1px solid rgb(240, 240, 240);
`

const MobileHeader = () => {
    const [isExpanded, setIsExpanded] = useState(false)
    const { push, pathname } = useRouter()
    useEffect(() => {
        setIsExpanded(false)
    }, [pathname])
    const { data: me, isLoading, isError } = useQuery('me', () => getMe())
    const logout = () => {
        localStorage.clear()
        push('/login')
        queryCache.invalidateQueries('me')
        setIsExpanded(false)
    }

    const isLoggedIn = localStorage.getItem('token')

    return (
        <>
            <Flex fluid justify="flex-end">
                <MenuButton
                    onClick={() => setIsExpanded((e) => !e)}
                    icon={<MenuOutlined />}
                />
            </Flex>
            <Menu direction="column" $expanded={isExpanded}>
                <Profile align="center" justify="space-between">
                    {!isLoggedIn && isError ? (
                        <Link href="/login" passHref>
                            <Button size="large" style={{ width: '100%' }}>
                                Login
                            </Button>
                        </Link>
                    ) : (
                        <Skeleton loading={isLoading} active>
                            <Flex align="center">
                                <Avatar size="large" src={me?.big_photo}>
                                    {me?.full_name
                                        .split(' ')
                                        .map((el) => el.charAt(0))}
                                </Avatar>
                                <TitleContainer direction="column">
                                    <Title>{me?.full_name}</Title>
                                    <Description>{me?.email}</Description>
                                </TitleContainer>
                            </Flex>
                            <Button onClick={logout}>Logout</Button>
                        </Skeleton>
                    )}
                </Profile>
                <Link href="/" passHref>
                    <Anchor>
                        <HomeOutlined />
                        Home
                    </Anchor>
                </Link>
                <Link href="/projects" passHref>
                    <Anchor>
                        <AppstoreOutlined />
                        Projects
                    </Anchor>
                </Link>
                <Link href="/activity" passHref>
                    <Anchor>
                        <HistoryOutlined />
                        Activity
                    </Anchor>
                </Link>
                <Link href="/your-work" passHref>
                    <Anchor>
                        <BlockOutlined />
                        Your Work
                    </Anchor>
                </Link>
            </Menu>
        </>
    )
}

export default MobileHeader
