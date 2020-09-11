import { useState } from 'react'
import styled from 'styled-components'
import EditButtonGroup from './EditButtonGroup'
import MarkdownIt from 'markdown-it'
import dynamic from 'next/dynamic'
import ReactMarkdown from 'react-markdown'

const mdParser = new MarkdownIt(/* Markdown-it options */)
const MdEditor = dynamic(() => import('react-markdown-editor-lite'), {
    ssr: false,
})

const DisplayContainer = styled.div`
    height: 200px;
    padding: 10px;
    border-radius: 4px;
    cursor: pointer;
    &:hover {
        background: #eee;
    }
`

const InputContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    margin-bottom: ${({ theme }) => theme.spacing.small};
`

interface Props {
    initialValue: string
}
export default function EditableDescription({ initialValue }: Props) {
    const [editable, setEditable] = useState(false)
    const [value, setValue] = useState(initialValue)

    function handleEditorChange({ html, text }) {
        setValue(text)
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
                value={value}
                onChange={handleEditorChange}
                renderHTML={(text) => mdParser.render(text)}
            />
            <EditButtonGroup
                onCancel={toggleEditable}
                onAccept={toggleEditable}
            />
        </InputContainer>
    ) : (
        <DisplayContainer onClick={toggleEditable}>
            <ReactMarkdown source={value}></ReactMarkdown>
        </DisplayContainer>
    )
}
