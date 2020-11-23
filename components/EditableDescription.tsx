import { useState } from 'react'
import styled from 'styled-components'
import MarkdownIt from 'markdown-it'
import dynamic from 'next/dynamic'
import ReactMarkdown from 'react-markdown'
import Flex from './Flex'
import ClearIcon from '@material-ui/icons/Clear'
import CheckIcon from '@material-ui/icons/Check'
import { Button } from 'antd'
import { updateTask } from '../taiga-api/tasks'
import { updateUserstory } from '../taiga-api/userstories'
import { queryCache } from 'react-query'
import { useRouter } from 'next/router'

const mdParser = new MarkdownIt(/* Markdown-it options */)
const MdEditor = dynamic(() => import('react-markdown-editor-lite'), {
    ssr: false,
})

const DisplayContainer = styled.div`
    height: 200px;
    width: 100%;
    padding: 10px;
    border-radius: 4px;
    cursor: pointer;
    &:hover {
        background: #eee;
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

const InputContainer = styled.div`
    display: flex;
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
    const [editable, setEditable] = useState(false)
    const [description, setDescription] = useState(initialValue)

    function handleEditorChange({ text }) {
        setDescription(text)
    }

    const onSubmit = async () => {
        if (type === 'task') {
            await updateTask(id, { version, description })
            queryCache.invalidateQueries(['tasks', { projectId, milestone }])
        } else {
            await updateUserstory(id, { version, description })
            queryCache.invalidateQueries(['backlog', { projectId }])
            queryCache.invalidateQueries(['milestones', { projectId }])
        }
        toggleEditable()
    }

    const toggleEditable = () => setEditable((editable) => !editable)
    return editable ? (
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
            <Flex>
                <StyledButton size="large" onClick={toggleEditable}>
                    <ClearIcon />
                </StyledButton>
                <StyledButton size="large" onClick={onSubmit}>
                    <CheckIcon />
                </StyledButton>
            </Flex>
        </InputContainer>
    ) : (
        <DisplayContainer onClick={toggleEditable}>
            <ReactMarkdown source={description}></ReactMarkdown>
        </DisplayContainer>
    )
}
