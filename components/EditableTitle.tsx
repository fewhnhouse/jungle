import { useState } from 'react'
import styled from 'styled-components'
import { FormInput, Button } from 'shards-react'
import CloseIcon from '@material-ui/icons/Close'
import CheckIcon from '@material-ui/icons/Check';

const Title = styled.h3`
    border-radius: 4px;
    height: 48px;
    padding: 4px 12px;
    line-height: 48px;
    &:hover {
        background: #e9ecef;
    }
    font-size: 1.6rem;
    font-weight: 300;
    color: #495057;
    cursor: pointer;
    margin-bottom: 5px;
`

const StyledInput = styled(FormInput)`
    padding: 4px 12px;
    font-size: 1.6rem;
    margin-right: 5px;
`

const StyledButton = styled(Button)`
    margin: 0px 5px;
    height: 35px;
    width: 35px;
    padding: 0px;
`

const InputContainer = styled.div`
    display: flex;
    margin-bottom: 5px;
    align-items: center;
`

export default function EditableTitle({ initialValue }: { initialValue: string }) {
    const [editable, setEditable] = useState(false)
    const [value, setValue] = useState(initialValue)

    const toggleEditable = () => setEditable((editable) => !editable)
    return editable ? (
        <InputContainer>
            <StyledInput
                autofocus="true"
                size="lg"
                value={value}
                onChange={(e) => setValue(e.target.value)}
            />
            <StyledButton onClick={toggleEditable} size="sm" theme="light">
                <CloseIcon />
            </StyledButton>
            <StyledButton size="sm" theme="light">
                <CheckIcon />
            </StyledButton>
        </InputContainer>
    ) : (
        <Title onClick={toggleEditable}>{value}</Title>
    )
}
