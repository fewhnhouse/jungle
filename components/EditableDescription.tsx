import { useState } from 'react'
import styled from 'styled-components'
import { FormTextarea } from 'shards-react'
import dynamic from 'next/dynamic'
import MarkdownIt from 'markdown-it'
import EditButtonGroup from './EditButtonGroup'

const MdEditor = dynamic(() => import('react-markdown-editor-lite'), {
    ssr: false,
})
const mdParser = new MarkdownIt(/* Markdown-it options */)

const Description = styled.p`
    border-radius: 4px;
    min-height: 80px;
    padding: 4px 12px;
    &:hover {
        background: #e9ecef;
    }
    font-weight: 300;
    color: #495057;
    cursor: pointer;
`

const StyledArea = styled(FormTextarea)`
    padding: 4px 12px;
    margin-right: 5px;
`

const InputContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    margin-bottom: 10px;
`

export default function EditableDescription({
    initialValue,
}: {
    initialValue: string
}) {
    const [editable, setEditable] = useState(false)
    const [value, setValue] = useState(initialValue)

    function handleEditorChange({ html, text }) {
        setValue(text)
    }

    const toggleEditable = () => setEditable((editable) => !editable)
    return editable ? (
        <InputContainer>
            <MdEditor
                config={{ view: { html: false, menu: true, md: true } }}
                value={value}
                style={{ height: '200px', width: '100%' }}
                onChange={handleEditorChange}
                renderHTML={(text) => mdParser.render(text)}
            />

            <EditButtonGroup onClick={toggleEditable} />
        </InputContainer>
    ) : (
        <Description
            dangerouslySetInnerHTML={{ __html: mdParser.render(value) }}
            onClick={toggleEditable}
        ></Description>
    )
}
