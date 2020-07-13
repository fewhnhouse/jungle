import styled from 'styled-components'
import {
    Button,
    Dropdown,
    DropdownMenu,
    DropdownItem,
} from 'shards-react'
import NotificationsIcon from '@material-ui/icons/Notifications'
import { useState } from 'react'

const ProfileBadge = styled.img`
    border-radius: 50%;
    width: 40px;
    height: 40px;
    margin: 0px 5px;
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
                        <Dropdown open={open} toggle={toggle}>
                    <ProfileBadge src="/bmo.png" onClick={toggle} />
                    <DropdownMenu right>
                        <DropdownItem>Action</DropdownItem>
                        <DropdownItem>Another action</DropdownItem>
                        <DropdownItem>Something else here</DropdownItem>
                    </DropdownMenu>
                </Dropdown>

    )
}