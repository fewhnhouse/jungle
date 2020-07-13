import Select from 'react-select'
import { useState } from 'react'
import styled from 'styled-components'
import { Button } from 'shards-react'

const customStyles = {
    option: (provided, state) => ({
        ...provided,
    }),
    control: (provided) => ({
        ...provided,
        height: 42,
        background: '#e9ecef',
        '&:hover': {
            background: '#dadfe4',
        },
        border: 'none',
        width: 160,
        margin: "5px 0px"
    }),
    indicatorSeparator: () => ({
        visibility: 'none',
    }),
    singleValue: (provided, state) => {
        const opacity = state.isDisabled ? 0.5 : 1
        const transition = 'opacity 300ms'

        return { ...provided, opacity, transition }
    },
}

export default function CustomSelect() {
    const [editable, setEditable] = useState(false)
    const toggleEditable = () => setEditable((editable) => !editable)

    return (
        <Select
            isSearchable={false}
            defaultValue={{ value: '1', label: 'To Do' }}
            options={[
                { value: '1', label: 'To Do' },
                { value: '2', label: 'Doing' },
            ]}
            styles={customStyles}
        />
    )
}
