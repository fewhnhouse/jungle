import { NotificationOutlined } from '@ant-design/icons'
import { Button, Dropdown, Typography } from 'antd'
import styled from 'styled-components'
import Flex from '../Flex'

const Container = styled.div`
    margin: 0px 10px;
`

const MenuContainer = styled(Flex)`
    width: 500px;
    height: 300px;
    background: white;
    border-radius: 2px;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.25);
    padding: 20px;
`

const menu = (
    <MenuContainer>
        <Flex direction="column">
            <Typography.Title level={3}>Notifications</Typography.Title>
            <Typography.Text>
                You have 7 Notifications across 5 Projects
            </Typography.Text>
        </Flex>
    </MenuContainer>
)

export default function Notifications() {
    return (
        <Container>
            <Dropdown trigger={['click']} overlay={menu}>
                <Button icon={<NotificationOutlined />}></Button>
            </Dropdown>
        </Container>
    )
}
