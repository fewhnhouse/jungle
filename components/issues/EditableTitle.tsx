import { useEffect, useState } from 'react'
import styled from 'styled-components'
import Flex from '../Flex'
import { Input } from 'antd'
import { Task, updateTask } from '../../taiga-api/tasks'
import { updateUserstory, UserStory } from '../../taiga-api/userstories'
import { useRouter } from 'next/router'
import { useQueryCache } from 'react-query'
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
        background-color: ${({ $focus }) => ($focus ? '' : '#e9ecef')};
    }
    transition: background-color 0.2s ease-in-out;
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
    const queryCache = useQueryCache()

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
                updateTaskCache(
                    updatedTask,
                    id,
                    projectId as string,
                    queryCache
                )
            })
        } else {
            updateUserstory(id, { version, subject }).then((updatedStory) => {
                updateUserstoryCache(
                    updatedStory,
                    id,
                    projectId as string,
                    queryCache
                )
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
