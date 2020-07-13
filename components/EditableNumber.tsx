import { useState } from 'react'
import styled from 'styled-components'
import { FormInput } from 'shards-react'
import EditButtonGroup from './EditButtonGroup'

const Title = styled.span`
    border-radius: 4px;
    height: 42px;
    width: 100px;
    padding: 4px 12px;
    line-height: 42px;
    &:hover {
        background: #e9ecef;
    }
    color: #495057;
    cursor: pointer;
    margin: 5px 0px;
`

const StyledInput = styled(FormInput)`
    padding: 4px 12px;
    margin-right: 5px;
`

const InputContainer = styled.div`
    display: flex;
    margin: 5px 0px;
    align-items: center;
    width: 130px;
`
interface Props {
    initialValue: number
}
export default function EditableNumber({ initialValue }: Props) {
    const [editable, setEditable] = useState(false)
    const [value, setValue] = useState(initialValue)

    const toggleEditable = () => setEditable((editable) => !editable)
    return editable ? (
        <InputContainer>
            <StyledInput
                autofocus="true"
                size="lg"
                type="number"
                value={value}
                onChange={(e) => setValue(e.target.value)}
            />
            <EditButtonGroup onClick={toggleEditable} />
        </InputContainer>
    ) : (
        <Title onClick={toggleEditable}>{value}</Title>
    )
}
