import styled from 'styled-components'
import Link from 'next/link'
import { useQuery } from 'react-query'
import { getMe } from '../../taiga-api/users'
import { Button, Dropdown, Menu } from 'antd'
import { getNameInitials } from '../../util/getNameInitials'
import Flex from '../Flex'
import Image from 'next/image'

const StyledButton = styled(Button)`
    width: 32px;
    height: 32px;
    padding: 0;
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
                    <Link href={`/users/${data?.id}`}>Profile</Link>
                </Menu.Item>
                <Menu.Item>
                    <Link href={`/users/${data?.id}/settings`}>Settings</Link>
                </Menu.Item>
                <Menu.Item onClick={() => localStorage.clear()}>
                    <Link href={`/login`}>Logout</Link>
                </Menu.Item>
            </Menu.ItemGroup>
        </Menu>
    )
    return (
        <Dropdown trigger={['click']} overlay={menu}>
            <StyledButton type="primary" shape="circle">
                {data?.photo && (
                    <Image
                        alt={data.full_name}
                        src={data.photo}
                        width={30}
                        height={30}
                    />
                )}
                {!data?.photo && getNameInitials(data?.full_name)}
            </StyledButton>
        </Dropdown>
    )
}
