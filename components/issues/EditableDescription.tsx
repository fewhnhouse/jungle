import { useEffect, useState } from 'react'
import styled from 'styled-components'
import Flex from '../Flex'
import { Task, updateTask } from '../../taiga-api/tasks'
import { updateUserstory, UserStory } from '../../taiga-api/userstories'
import { queryCache } from 'react-query'
import { useRouter } from 'next/router'
import { updateTaskCache, updateUserstoryCache } from '../../updateCache'
import useDebounce from '../../util/useDebounce'
import { Input } from 'antd'

const InputContainer = styled.div`
    display: flex;
    width: 100%;
    margin-top: ${({ theme }) => theme.spacing.small};
    flex-direction: column;
    align-items: flex-end;
    margin-bottom: ${({ theme }) => theme.spacing.small};
`

const StyledTextArea = styled(Input.TextArea)<{ $focus }>`
    font-size: 16px;
    margin-left: 5px;
    &:hover {
        background: ${({ $focus }) => ($focus ? '' : '#e9ecef')};
    }
`

interface Props {
    initialValue: string
    id: number
    milestone?: number | null
    type: 'task' | 'userstory'
    version: number
}
export default function EditableDescription({
    initialValue,
    type,
    id,
    version,
}: Props) {
    const { projectId } = useRouter().query
    const [description, setDescription] = useState(initialValue)
    const [focus, setFocus] = useState(false)
    const debouncedDescription = useDebounce(description, 500)

    useEffect(() => {
        if (debouncedDescription) {
            queryCache.setQueryData(
                [type, { id }],
                (prevData: UserStory | Task) => ({
                    ...prevData,
                    description,
                })
            )
            if (type === 'task') {
                updateTask(id, {
                    version,
                    description,
                }).then((updatedTask) => {
                    updateTaskCache(updatedTask, id, projectId as string)
                })
            } else {
                updateUserstory(id, {
                    version,
                    description,
                }).then((updatedStory) => {
                    updateUserstoryCache(updatedStory, id, projectId as string)
                })
            }
        }
    }, [debouncedDescription, type])

    return (
        <InputContainer>
            <StyledTextArea
                placeholder="Description..."
                $focus={focus}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setDescription(e.target.value)
                }
                onFocus={() => setFocus(true)}
                onBlur={() => setFocus(false)}
                bordered={focus}
                autoSize={{ minRows: 4, maxRows: 8 }}
            ></StyledTextArea>
            <Flex style={{ marginTop: 5 }}>
                <span>Your changes will automatically be saved.</span>
            </Flex>
        </InputContainer>
    )
}