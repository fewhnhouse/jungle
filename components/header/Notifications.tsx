import NotificationsIcon from '@material-ui/icons/Notifications'
import { Dropdown, Badge, Button } from 'rsuite'
import styled from 'styled-components'

const Container = styled.div`
    margin: 0px 10px;
`

export default function Notifications() {
    return (
        <Container>
            <Badge>
                <Dropdown
                    placement="bottomEnd"
                    noCaret
                    renderTitle={() => <Button size="sm">{<NotificationsIcon />}</Button>}
                >
                    <Dropdown.Item>Action</Dropdown.Item>
                    <Dropdown.Item>Another action</Dropdown.Item>
                    <Dropdown.Item>Something else here</Dropdown.Item>
                </Dropdown>
            </Badge>
        </Container>
    )
}
