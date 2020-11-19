import { useState } from 'react'
import styled from 'styled-components'
import ClearIcon from '@material-ui/icons/Clear'
import CheckIcon from '@material-ui/icons/Check'
import Flex from './Flex'
import { Button, Input } from 'antd'

const Title = styled.h2`
    border-radius: 2px;
    width: 100%;
    height: 42px;
    max-width: 280px;
    padding: ${({ theme }) => `${theme.spacing.mini} ${theme.spacing.small}`};
    line-height: 30px;
    &:hover {
        background: #e9ecef;
    }
    font-size: 1.2rem;
    font-weight: 300;
    color: #495057;
    cursor: pointer;
    margin: ${({ theme }) => theme.spacing.mini} 0px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    span {
        margin-right: 5px;
    }
`

const StyledButton = styled(Button)`
    margin-left: 5px;
    width: 40px;
    padding: 0px;
    display: flex;
    align-items: center;
    justify-content: center;
`

const InputContainer = styled.form`
    display: flex;
    margin: ${({ theme }) => theme.spacing.mini} 0px;
    align-items: center;
`
interface Props {
    initialValue: string
    onSubmit: (value: string) => void
}

export default function EditableTitle({ initialValue, onSubmit }: Props) {
    const [editable, setEditable] = useState(false)
    const [value, setValue] = useState(initialValue)

    const toggleEditable = () => setEditable((editable) => !editable)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSubmit(value)
        toggleEditable()
    }

    return (
        <div>
            {editable ? (
                <InputContainer onSubmit={handleSubmit}>
                    <Flex>
                        <Input
                            size="large"
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                        />
                        <Flex>
                            <StyledButton size="large" onClick={toggleEditable}>
                                <ClearIcon />
                            </StyledButton>
                            <StyledButton size="large" onClick={toggleEditable}>
                                <CheckIcon />
                            </StyledButton>
                        </Flex>
                    </Flex>
                </InputContainer>
            ) : (
                <Title onClick={toggleEditable}>{value}</Title>
            )}
        </div>
    )
}
