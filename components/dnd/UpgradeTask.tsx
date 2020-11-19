import { Button, Popconfirm } from 'antd'
import styled from 'styled-components'

const StyledButton = styled(Button)`
    margin-top: 10px;
`

const UpgradeTask = () => {
    const handleUpgrade = () => {
        console.log('convert')
    }
    return (
        <Popconfirm
            title="Are you sure you want to convert this task to a User Story?"
            onConfirm={handleUpgrade}
        >
            <StyledButton>Convert</StyledButton>
        </Popconfirm>
    )
}

export default UpgradeTask
