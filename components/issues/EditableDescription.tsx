import { useEffect, useState } from 'react'
import styled from 'styled-components'
import Flex from '../Flex'
import { Task, updateTask } from '../../taiga-api/tasks'
import { updateUserstory, UserStory } from '../../taiga-api/userstories'
import { useQueryCache } from 'react-query'
import { useRouter } from 'next/router'
import { updateTaskCache, updateUserstoryCache } from '../../updateCache'
import useDebounce from '../../util/useDebounce'
import 'braft-editor/dist/index.css'
import BraftEditor, { EditorState } from 'braft-editor'

const InputContainer = styled.div`
    display: flex;
    width: 100%;
    margin-top: ${({ theme }) => theme.spacing.small};
    flex-direction: column;
    align-items: flex-end;
    margin-bottom: ${({ theme }) => theme.spacing.small};
`

const StyledBraftEditor = styled(BraftEditor)<{ $focus: boolean }>`
    border-radius: 2px;
    &:hover {
        background-color: ${({ $focus }) => ($focus ? '' : '#e9ecef')};
    }
    transition: background-color 0.2s ease-in-out;
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
    const [editorState, setEditorState] = useState<EditorState>(
        BraftEditor.createEditorState(initialValue)
    )

    const [focus, setFocus] = useState(false)
    const queryCache = useQueryCache()

    const handleChange = (editorState: EditorState) => {
        setEditorState(editorState)
    }

    const debouncedState: EditorState = useDebounce(editorState, 500)

    useEffect(() => {
        const description = debouncedState.toHTML()
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
    }, [type, debouncedState])

    return (
        <InputContainer>
            <StyledBraftEditor
                $focus={focus}
                language="en"
                controlBarStyle={{
                    visibility: focus ? 'visible' : 'hidden',
                    display: focus ? 'block' : 'none',
                }}
                value={editorState}
                className="my-editor"
                onFocus={() => setFocus(true)}
                onBlur={() => setFocus(false)}
                style={{
                    width: '100%',
                    height: 300,
                }}
                onChange={handleChange}
                contentStyle={{ height: 300 }}
                controls={[
                    'text-color',
                    'bold',
                    'italic',
                    'underline',
                    'strike-through',
                    'separator',
                    // 'headings',
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
