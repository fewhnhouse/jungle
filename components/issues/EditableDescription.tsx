import { useEffect, useState } from 'react'
import styled from 'styled-components'
import MarkdownIt from 'markdown-it'
import dynamic from 'next/dynamic'
import Flex from '../Flex'
import { Task, updateTask } from '../../taiga-api/tasks'
import { updateUserstory, UserStory } from '../../taiga-api/userstories'
import { queryCache } from 'react-query'
import { useRouter } from 'next/router'
import { updateTaskCache, updateUserstoryCache } from '../../updateCache'
import useDebounce from '../../util/useDebounce'

const mdParser = new MarkdownIt(/* Markdown-it options */)
const MdEditor = dynamic(() => import('react-markdown-editor-lite'), {
    ssr: false,
})

const InputContainer = styled.div`
    display: flex;
    margin-top: ${({ theme }) => theme.spacing.small};
    flex-direction: column;
    align-items: flex-end;
    margin-bottom: ${({ theme }) => theme.spacing.small};
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
    milestone,
    version,
}: Props) {
    const { projectId } = useRouter().query
    const [description, setDescription] = useState(initialValue)

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
    function handleEditorChange({ text }) {
        setDescription(text)
    }
    return (
        <InputContainer>
            <MdEditor
                shortcuts
                config={{
                    shortcuts: true,
                    view: { menu: true, md: true, html: false },
                    canView: {
                        menu: true,
                        md: true,
                        html: false,
                        fullScreen: false,
                        hideMenu: false,
                    },
                }}
                style={{ height: 200 }}
                value={description}
                onChange={handleEditorChange}
                renderHTML={(text) => mdParser.render(text)}
            />
            <Flex style={{ marginTop: 5 }}>
                <span>Your changes will automatically be saved.</span>
            </Flex>
        </InputContainer>
    )
}
