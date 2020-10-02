import { NotificationOutlined } from '@ant-design/icons'
import { Button, Dropdown, Menu } from 'antd'
import styled from 'styled-components'


const Container = styled.div`
    margin: 0px 10px;
`
const menu = (
    <Menu>
        <Menu.Item>
            <a
                target="_blank"
                rel="noopener noreferrer"
                href="http://www.alipay.com/"
            >
                1st menu item
            </a>
        </Menu.Item>
        <Menu.Item>
            <a
                target="_blank"
                rel="noopener noreferrer"
                href="http://www.taobao.com/"
            >
                2nd menu item
            </a>
        </Menu.Item>
        <Menu.Item>
            <a
                target="_blank"
                rel="noopener noreferrer"
                href="http://www.tmall.com/"
            >
                3rd menu item
            </a>
        </Menu.Item>
    </Menu>
)

export default function Notifications() {
    return (
        <Container>
            <Dropdown overlay={menu}>
                <Button icon={<NotificationOutlined />}></Button>
            </Dropdown>
        </Container>
    )
}
