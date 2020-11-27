import { CheckOutlined } from '@ant-design/icons'
import { Spin } from 'antd'
import styled from 'styled-components'
import Flex from './Flex'

const Loader = styled(Flex)`
    position: fixed;
    bottom: 5px;
    right: 5px;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.25);
    padding: 5px;
    border-radius: 4px;
`

const CustomAvatar = styled(Flex)`
    width: 20px;
    height: 20px;
    background: #2ecc71;
    border-radius: 4px;
    margin-right: 5px;
    color: white;
`

const SpinContainer = styled(Flex)`
    width: 20px;
    height: 20px;
    border-radius: 4px;
    margin-right: 5px;
`

interface Props {
    isUpdating?: boolean
}

const Updater = ({ isUpdating }: Props) => {
    return isUpdating ? (
        <Loader align="center">
            <SpinContainer align="center" justify="center">
                <Spin style={{ height: 16, width: 16 }} size="small" />
            </SpinContainer>
            Updating...
        </Loader>
    ) : (
        <Loader align="center">
            <CustomAvatar align="center" justify="center">
                <CheckOutlined />
            </CustomAvatar>
            Up to date.
        </Loader>
    )
}

export default Updater
