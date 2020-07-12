import { useState } from 'react'
import { Typography, TextField } from '@material-ui/core'
import styled from 'styled-components'

const Text = styled.span``

export default function TextInput({
    initialValue,
    variant,
}: {
    initialValue: string
    variant:
        | 'button'
        | 'caption'
        | 'h1'
        | 'h2'
        | 'h3'
        | 'h4'
        | 'h5'
        | 'h6'
        | 'inherit'
        | 'subtitle1'
        | 'subtitle2'
        | 'body1'
        | 'body2'
        | 'overline'
        | 'srOnly'
}) {
    const [editable, setEditable] = useState(false)
    const [value, setValue] = useState(initialValue)

    const toggleEditable = () => setEditable((editable) => !editable)
    return editable ? (
        <TextField
            onClick={toggleEditable}
            value={value}
            id="outlined-basic"
            label="Outlined"
            variant="outlined"
        />
    ) : (
        <Typography onClick={toggleEditable} variant={variant}>
            {value}
        </Typography>
    )
}
