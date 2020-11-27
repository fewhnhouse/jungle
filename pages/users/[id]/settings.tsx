import Head from 'next/head'
import { useState } from 'react'
import { useQuery } from 'react-query'
import styled from 'styled-components'
import { PageBody, PageHeader } from '../../../components/Layout'
import PageTitle from '../../../components/PageTitle'
import Settings from '../../../components/Settings'
import UserDetails from '../../../components/user-settings/UserDetails'
import { getMe, getUser } from '../../../taiga-api/users'

const HeaderContainer = styled.div`
    margin: auto;
    max-width: 840px;
`

export default function ProjectSettings() {
    const [menuItemIndex, setMenuItemIndex] = useState(0)

    const handleItemClick = (index: number) => () => setMenuItemIndex(index)

    const { data: me } = useQuery('me', () => getMe())

    const menuItems = [
        'User Details',
        'Email Notifications',
        'Desktop Notifications',
        'Events',
        'Start Pages',
    ]

    return (
        <div>
            <Head>
                <title>User Settings</title>
                <meta
                    name="viewport"
                    content="initial-scale=1.0, width=device-width"
                />
            </Head>

            <PageHeader>
                <HeaderContainer>
                    <PageTitle
                        title="Settings"
                        description={`For User ${me?.full_name}`}
                    />
                </HeaderContainer>
            </PageHeader>
            <PageBody>
                <Settings
                    onMenuItemClick={handleItemClick}
                    menuItems={menuItems}
                    menuIndex={menuItemIndex}
                >
                    {menuItemIndex === 0 && <UserDetails />}
                </Settings>
            </PageBody>
        </div>
    )
}
