import styled from 'styled-components'
import { useState } from 'react'
import { Avatar, Dropdown } from 'rsuite'
import Link from 'next/link'

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
    const toggle = () => setOpen((open) => !open)

    return (
        <Dropdown
            placement="bottomEnd"
            renderTitle={() => <Avatar circle>FW</Avatar>}
            noCaret
        >
            <Dropdown.Item>
                <Link href="/user/settings">
                    <a>Settings</a>
                </Link>
            </Dropdown.Item>
        </Dropdown>
    )
}
