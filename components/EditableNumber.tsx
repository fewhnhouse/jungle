import { useState } from 'react'
import styled from 'styled-components'
import ClearIcon from '@material-ui/icons/Clear'
import CheckIcon from '@material-ui/icons/Check'
import { Button, Input } from 'antd'
import { ClearOutlined } from '@ant-design/icons'
import Flex from './Flex'

const Title = styled.span`
    border-radius: 4px;
    height: 42px;
    width: 100%;
    padding: ${({ theme }) => `${theme.spacing.mini} ${theme.spacing.small}`};
    line-height: 30px;
    &:hover {
        background: #e9ecef;
    }
    color: #495057;
    cursor: pointer;
    margin: ${({ theme }) => theme.spacing.mini} 0px;
`

const StyledButton = styled(Button)`
    margin-left: 5px;
    width: 40px;
    padding: 0px;
    display: flex;
    align-items: center;
    justify-content: center;
`

interface Props {
    initialValue: number
}

export default function EditableNumber({ initialValue }: Props) {
    const [editable, setEditable] = useState(false)
    const [value, setValue] = useState(initialValue + '')

    const toggleEditable = () => setEditable((editable) => !editable)
    return editable ? (
        <Flex>
            <Input
                type="number"
                value={value}
                onChange={(e) => setValue(e.target.value)}
            />
            <Flex>
                <StyledButton onClick={toggleEditable}>
                    <ClearIcon />
                </StyledButton>
                <StyledButton onClick={toggleEditable}>
                    <CheckIcon />
                </StyledButton>
            </Flex>
        </Flex>
    ) : (
        <Title onClick={toggleEditable}>{value}</Title>
    )
}
