import { useState } from 'react'
import styled from 'styled-components'
import Flex from '../Flex'
import { Button, Input } from 'antd'
import { Task, updateTask } from '../../taiga-api/tasks'
import { updateUserstory, UserStory } from '../../taiga-api/userstories'
import { useRouter } from 'next/router'
import { queryCache } from 'react-query'
import { updateTaskCache, updateUserstoryCache } from '../../updateCache'
import { CheckOutlined, CloseOutlined } from '@ant-design/icons'

const Title = styled.h2`
    border-radius: 2px;
    width: 100%;
    padding: ${({ theme }) => `${theme.spacing.mini} ${theme.spacing.small}`};
    &:hover {
        background: #e9ecef;
    }
    font-size: 1.2rem;
    color: #495057;
    cursor: pointer;
    margin: ${({ theme }) => theme.spacing.mini} 0px;
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
    id: number
    milestone?: number
    type: 'task' | 'userstory'
    version: number
}

export default function EditableTitle({
    initialValue,
    id,
    milestone,
    type,
    version,
}: Props) {
    const { projectId } = useRouter().query

    const [editable, setEditable] = useState(false)
    const [subject, setSubject] = useState(initialValue)

    const toggleEditable = () => setEditable((editable) => !editable)

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        queryCache.setQueryData(
            [type, { id }],
            (prevData: UserStory | Task) => ({
                ...prevData,
                subject,
            })
        )
        if (type === 'task') {
            const updatedTask = await updateTask(id, { version, subject })
            updateTaskCache(updatedTask, id, projectId as string)
        } else {
            const updatedStory = await updateUserstory(id, { version, subject })
            updateUserstoryCache(updatedStory, id, projectId as string)
        }
        toggleEditable()
    }

    return (
        <div>
            {editable ? (
                <InputContainer onSubmit={onSubmit}>
                    <Flex>
                        <Input
                            size="large"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                        />
                        <Flex>
                            <StyledButton size="large" onClick={toggleEditable}>
                                <CloseOutlined />
                            </StyledButton>
                            <StyledButton size="large" onClick={toggleEditable}>
                                <CheckOutlined />
                            </StyledButton>
                        </Flex>
                    </Flex>
                </InputContainer>
            ) : (
                <Title onClick={toggleEditable}>{subject}</Title>
            )}
        </div>
    )
}
