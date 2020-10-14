import styled from 'styled-components'
import { useState } from 'react'
import Link from 'next/link'
import { useQuery } from 'react-query'
import { getMe } from '../../taiga-api/users'
import { Avatar, Dropdown, Menu } from 'antd'
import { getNameInitials } from '../../util/getNameInitials'

const ProfileBadge = styled(Avatar)`
    cursor: pointer;
    transition: box-shadow 0.2s ease-in-out;
    &:hover {
        box-shadow: 0px 0px 2px 1px rgba(0, 0, 0, 0.3);
    }
`

export default function Profile() {
    const [open, setOpen] = useState(false)
    const { data } = useQuery('me', () => getMe())
    const toggle = () => setOpen((open) => !open)

    const menu = (
        <Menu>
            <Menu.Item>
                <Link as={`/user/${data?.id}`} href="/user/[id]">
                    Profile
                </Link>
            </Menu.Item>
            <Menu.Item>
                <Link href="/user/settings">Settings</Link>
            </Menu.Item>
        </Menu>
    )
    return (
        <Dropdown trigger={['click']} overlay={menu}>
            <ProfileBadge src={data?.photo}>
                {getNameInitials(data?.full_name)}
            </ProfileBadge>
        </Dropdown>
    )
}
