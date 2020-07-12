import { useState } from 'react'
import styled from 'styled-components'
import { FormTextarea, Button } from 'shards-react'
import CloseIcon from '@material-ui/icons/Close'
import CheckIcon from '@material-ui/icons/Check'
import dynamic from 'next/dynamic'
import MarkdownIt from 'markdown-it'

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

const StyledButton = styled(Button)`
    margin: 0px 5px;
    height: 35px;
    width: 35px;
    padding: 0px;
`

const InputContainer = styled.div`
    display: flex;
    align-items: center;
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

            <StyledButton onClick={toggleEditable} size="sm" theme="light">
                <CloseIcon />
            </StyledButton>
            <StyledButton size="sm" theme="light">
                <CheckIcon />
            </StyledButton>
        </InputContainer>
    ) : (
        <Description
            dangerouslySetInnerHTML={{ __html: mdParser.render(value) }}
            onClick={toggleEditable}
        ></Description>
    )
}
