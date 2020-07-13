import { useState } from 'react'
import styled from 'styled-components'
import { FormInput } from 'shards-react'
import EditButtonGroup from './EditButtonGroup'

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
    margin: 5px 0px;
`

const StyledInput = styled(FormInput)`
    padding: 4px 12px;
    font-size: 1.6rem;
    margin-right: 5px;
`

const InputContainer = styled.div`
    display: flex;
    margin: 5px 0px;
    align-items: center;
`

export default function EditableTitle({
    initialValue,
}: {
    initialValue: string
}) {
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
            <EditButtonGroup onClick={toggleEditable} />
        </InputContainer>
    ) : (
        <Title onClick={toggleEditable}>{value}</Title>
    )
}
