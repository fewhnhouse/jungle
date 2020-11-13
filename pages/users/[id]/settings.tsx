import { useState } from 'react'
import styled from 'styled-components'
import { PageBody, PageHeader } from '../../../components/Layout'
import PageTitle from '../../../components/PageTitle'
import Settings from '../../../components/Settings'
import UserDetails from '../../../components/user-settings/UserDetails'

const HeaderContainer = styled.div`
    margin: auto;
    max-width: 840px;
`

export default function ProjectSettings() {
    const [menuItemIndex, setMenuItemIndex] = useState(0)

    const handleItemClick = (index: number) => () => setMenuItemIndex(index)

    const menuItems = [
        'User Details',
        'Email Notifications',
        'Desktop Notifications',
        'Events',
        'Start Pages',
    ]

    return (
        <div>
            <PageHeader>
                <HeaderContainer>
                    <PageTitle
                        title="Settings"
                        description={`For User Admin`}
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
