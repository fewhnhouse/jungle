import styled from 'styled-components'
import { Button, Dropdown, DropdownMenu, DropdownItem } from 'shards-react'
import NotificationsIcon from '@material-ui/icons/Notifications'
import { useState } from 'react'

const StyledButton = styled(Button)`
    margin: 0px 5px;
    padding: 5px;
    height: 40px;
`

export default function Notifications() {
    const [open, setOpen] = useState(false)
    const toggle = () => setOpen((open) => !open)

    return (
        <>
            <Dropdown open={open} toggle={toggle}>
                <StyledButton theme="light" onClick={toggle}>
                    <NotificationsIcon />
                </StyledButton>
                <DropdownMenu right>
                    <DropdownItem>Action</DropdownItem>
                    <DropdownItem>Another action</DropdownItem>
                    <DropdownItem>Something else here</DropdownItem>
                </DropdownMenu>
            </Dropdown>
        </>
    )
}
