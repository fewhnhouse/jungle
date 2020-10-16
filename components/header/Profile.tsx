import styled from 'styled-components'
import Link from 'next/link'
import { useQuery } from 'react-query'
import { getMe } from '../../taiga-api/users'
import { Avatar, Dropdown, Menu } from 'antd'
import { getNameInitials } from '../../util/getNameInitials'
import Flex from '../Flex'

const ProfileBadge = styled(Avatar)`
    cursor: pointer;
    transition: box-shadow 0.2s ease-in-out;
    &:hover {
        box-shadow: 0px 0px 2px 1px rgba(0, 0, 0, 0.3);
    }
`

export default function Profile() {
    const { data } = useQuery('me', () => getMe())

    const menu = (
        <Menu>
            <Menu.ItemGroup
                title={
                    <Flex direction="column">
                        <span>{data?.full_name}</span>
                        <span>{data?.email} </span>
                    </Flex>
                }
            >
                <Menu.Item>
                    <Link as={`/users/${data?.id}`} href="/user/[id]">
                        Profile
                    </Link>
                </Menu.Item>
                <Menu.Item>
                    <Link href="/users/settings">Settings</Link>
                </Menu.Item>
            </Menu.ItemGroup>
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
