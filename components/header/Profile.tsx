import styled from 'styled-components'
import { useState } from 'react'
import { Avatar, Dropdown } from 'rsuite'
import Link from 'next/link'
import { useQuery } from 'react-query'
import { getMe } from '../../taiga-api/users'

const ProfileBadge = styled.img`
    border-radius: 50%;
    width: 40px;
    height: 40px;
    margin: 0px ${({ theme }) => `${theme.spacing.small}`};
    cursor: pointer;
    transition: box-shadow 0.3s ease-in-out;
    &:hover {
        box-shadow: rgba(0, 0, 0, 0.5) 0px 0px 15px 0px;
    }
`

export default function Profile() {
    const [open, setOpen] = useState(false)
    const { data } = useQuery('me', () => getMe())
    const toggle = () => setOpen((open) => !open)

    return (
        <Dropdown
            placement="bottomEnd"
            renderTitle={() => (
                <Avatar circle src={data?.photo}>
                    {data?.username.charAt(0)}
                </Avatar>
            )}
            noCaret
        >
            <Dropdown.Item>
                <Link as={`/user/${data?.id}`} href="/user/[id]">
                    Profile
                </Link>
            </Dropdown.Item>
            <Dropdown.Item>
                <Link href="/user/settings">Settings</Link>
            </Dropdown.Item>
        </Dropdown>
    )
}
