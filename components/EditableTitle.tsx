import { useState } from 'react'
import styled from 'styled-components'
import { Input } from 'rsuite'
import EditButtonGroup from './EditButtonGroup'

const Title = styled.h3`
    border-radius: 4px;
    height: 48px;
    padding: ${({ theme }) => `${theme.spacing.mini} ${theme.spacing.small}`};
    line-height: 48px;
    &:hover {
        background: #e9ecef;
    }
    font-size: 1.6rem;
    font-weight: 300;
    color: #495057;
    cursor: pointer;
    margin: ${({ theme }) => theme.spacing.mini} 0px;
`

const StyledInput = styled(Input)`
    padding: 4px 8px;
    font-size: 1.6rem;
    margin-right: 4px;
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
            <Input
                autofocus
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
