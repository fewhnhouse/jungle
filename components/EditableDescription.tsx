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
                style={{ height: 200 }}
                value={value}
                view={{ menu: true, md: true, html: false }}
                canView={{
                    menu: true,
                    md: true,
                    html: false,
                    fullScreen: false,
                    hideMenu: false,
                }}
                onChange={handleEditorChange}
                renderHTML={(text) => mdParser.render(text)}
            />
            <EditButtonGroup onClick={toggleEditable} />
        </InputContainer>
    ) : (
        <div style={{ padding: 10 }} onClick={toggleEditable}>
            <ReactMarkdown source={value}></ReactMarkdown>
        </div>
    )
}
