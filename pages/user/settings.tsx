import { useState } from 'react'
import { PageBody, PageHeader } from '../../components/Layout'
import PageTitle from '../../components/PageTitle'
import Settings from '../../components/Settings'
import UserDetails from '../../components/user-settings/UserDetails'

export default function ProjectSettings() {
    const [menuItemIndex, setMenuItemIndex] = useState(0)

    const handleItemClick = (index: number) => () => setMenuItemIndex(index)

    const menuItems = [
        'User Details',
        'Email Notifications',
        'Desktop Notifications',
        'Events',
        'Start Pages',
        'Change Password',
    ]
    
    return (
        <div>
            <PageHeader>
                <PageTitle title="Settings" description={`For User Admin`} />
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
