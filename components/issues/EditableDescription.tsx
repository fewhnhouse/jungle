import { useEffect, useState } from 'react'
import styled from 'styled-components'
import Flex from '../Flex'
import { Task, updateTask } from '../../taiga-api/tasks'
import { updateUserstory, UserStory } from '../../taiga-api/userstories'
import { useQueryCache } from 'react-query'
import { useRouter } from 'next/router'
import { updateTaskCache, updateUserstoryCache } from '../../updateCache'
import useDebounce from '../../util/useDebounce'
import { Button, Form, Input } from 'antd'
import dynamic from 'next/dynamic'
import 'braft-editor/dist/index.css'

const BraftEditor = dynamic(() => import('braft-editor'), { ssr: false })

const InputContainer = styled.div`
    display: flex;
    width: 100%;
    margin-top: ${({ theme }) => theme.spacing.small};
    flex-direction: column;
    align-items: flex-end;
    margin-bottom: ${({ theme }) => theme.spacing.small};
`

const StyledTextArea = styled.div`
    font-size: 16px;
    margin-left: 5px;
    &:hover {
        background: '#e9ecef';
    }
`

const StyledBraftEditor = styled(BraftEditor)<{ $focus: boolean }>`
    border-radius: 2px;
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
    const queryCache = useQueryCache()

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
                    updateTaskCache(
                        updatedTask,
                        id,
                        projectId as string,
                        queryCache
                    )
                })
            } else {
                updateUserstory(id, {
                    version,
                    description,
                }).then((updatedStory) => {
                    updateUserstoryCache(
                        updatedStory,
                        id,
                        projectId as string,
                        queryCache
                    )
                })
            }
        }
    }, [debouncedDescription, type])

    return (
        <InputContainer>
            {/* <StyledTextArea
                placeholder="Description..."
                $focus={focus}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setDescription(e.target.value)
                }
                onFocus={() => setFocus(true)}
                onBlur={() => setFocus(false)}
                bordered={focus}
                autoSize={{ minRows: 4, maxRows: 8 }}
            ></StyledTextArea> */}
            <StyledBraftEditor
                $focus={focus}
                language="en"
                controlBarStyle={{
                    visibility: focus ? 'visible' : 'hidden',
                    display: focus ? 'block' : 'none'
                }}
                className="my-editor"
                onFocus={() => setFocus(true)}
                onBlur={() => setFocus(false)}
                style={{ width: '100%', height: 300 }}
                contentStyle={{ height: 300 }}
                controls={[
                    'text-color',
                    'bold',
                    'italic',
                    'underline',
                    'strike-through',
                    'separator',
                    'headings',
                    'blockquote',
                    'code',
                    'link',
                    'list-ul',
                    'list-ol',
                    'table',
                ]}
                placeholder="Description..."
            />
            <Flex style={{ marginTop: 5 }}>
                <span>Your changes will automatically be saved.</span>
            </Flex>
        </InputContainer>
    )
}
