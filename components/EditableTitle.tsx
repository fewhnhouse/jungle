import { useState } from 'react'
import styled from 'styled-components'
import { Input, InputGroup } from 'rsuite'
import ClearIcon from '@material-ui/icons/Clear'
import CheckIcon from '@material-ui/icons/Check'
const Title = styled.h3`
    border-radius: 4px;
    height: 42px;
    padding: ${({ theme }) => `${theme.spacing.mini} ${theme.spacing.small}`};
    line-height: 30px;
    &:hover {
        background: #e9ecef;
    }
    font-size: 1.6rem;
    font-weight: 300;
    color: #495057;
    cursor: pointer;
    margin: ${({ theme }) => theme.spacing.mini} 0px;
`

const InputContainer = styled.div`
    display: flex;
    margin: ${({ theme }) => theme.spacing.mini} 0px;
    align-items: center;
`
interface Props {
    initialValue: string
}

export default function EditableTitle({ initialValue }: Props) {
    const [editable, setEditable] = useState(false)
    const [value, setValue] = useState(initialValue)

    const toggleEditable = () => setEditable((editable) => !editable)
    return editable ? (
        <InputContainer>
            <InputGroup size="lg">
                <Input
                    autofocus
                    size="lg"
                    value={value}
                    onChange={(value) => setValue(value)}
                />
                <InputGroup.Button onClick={toggleEditable}>
                    <ClearIcon />
                </InputGroup.Button>

                <InputGroup.Button onClick={toggleEditable}>
                    <CheckIcon />
                </InputGroup.Button>
            </InputGroup>
        </InputContainer>
    ) : (
        <Title onClick={toggleEditable}>{value}</Title>
    )
}
