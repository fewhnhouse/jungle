import { useEffect, useState } from 'react'
import styled from 'styled-components'
import Flex from '../Flex'
import { Input } from 'antd'
import { Task, updateTask } from '../../taiga-api/tasks'
import { updateUserstory, UserStory } from '../../taiga-api/userstories'
import { useRouter } from 'next/router'
import { queryCache } from 'react-query'
import { updateTaskCache, updateUserstoryCache } from '../../updateCache'
import useDebounce from '../../util/useDebounce'

const TitleContainer = styled.div`
    width: 100%;
`

const InputContainer = styled.form`
    display: flex;
    margin: ${({ theme }) => theme.spacing.mini} 0px;
    align-items: center;
`

const StyledInput = styled(Input)<{ $focus }>`
    font-size: 20px !important;
    input {
        font-size: 20px !important;
    }
    &:hover {
        background: ${({ $focus }) => ($focus ? '' : '#e9ecef')};
    }
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
    type,
    version,
}: Props) {
    const { projectId } = useRouter().query

    const [subject, setSubject] = useState(initialValue)
    const [focus, setFocus] = useState(false)
    const debouncedSubject = useDebounce(subject, 500)

    useEffect(() => {
        queryCache.setQueryData(
            [type, { id }],
            (prevData: UserStory | Task) => ({
                ...prevData,
                subject,
            })
        )
        if (type === 'task') {
            updateTask(id, { version, subject }).then((updatedTask) => {
                updateTaskCache(updatedTask, id, projectId as string)
            })
        } else {
            updateUserstory(id, { version, subject }).then((updatedStory) => {
                updateUserstoryCache(updatedStory, id, projectId as string)
            })
        }
    }, [debouncedSubject])

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
    }

    return (
        <TitleContainer>
            <InputContainer onSubmit={onSubmit}>
                <Flex style={{ width: '100%' }} align="center">
                    <StyledInput
                        $focus={focus}
                        size="large"
                        onFocus={() => setFocus(true)}
                        onBlur={() => setFocus(false)}
                        placeholder="Subject..."
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        bordered={focus}
                    />
                </Flex>
            </InputContainer>
        </TitleContainer>
    )
}