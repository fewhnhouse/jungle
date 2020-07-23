import { useState } from 'react'
import styled from 'styled-components'
import dynamic from 'next/dynamic'
import EditButtonGroup from './EditButtonGroup'

/*
const MdEditor = dynamic(() => import('react-markdown-editor-lite'), {
    ssr: false,
})
const mdParser = new MarkdownIt()
*/

const Description = styled.p`
    border-radius: 4px;
    min-height: 80px;
    padding: ${({ theme }) => `${theme.spacing.mini} ${theme.spacing.small}`};
    &:hover {
        background: #e9ecef;
    }
    font-weight: 300;
    color: #495057;
    cursor: pointer;
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
            {/*
            <MdEditor
            config={{ view: { html: false, menu: true, md: true } }}
            value={value}
            style={{ height: '200px', width: '100%' }}
            onChange={handleEditorChange}
            renderHTML={(text) => mdParser.render(text)}
            />
            
        */}
            <EditButtonGroup onClick={toggleEditable} />
        </InputContainer>
    ) : (
        <div>Editor</div>
    )
}
