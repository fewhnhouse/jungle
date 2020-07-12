import Select from 'react-select'
import { useState } from 'react'
import styled from 'styled-components'
import { Button } from 'shards-react'

const Title = styled.h3`
    border-radius: 4px;
    height: 48px;
    padding: 4px 12px;
    line-height: 48px;
    &:hover {
        background: #e9ecef;
    }
    font-size: 16px;
    font-weight: 300;
    color: #495057;
    cursor: pointer;
    margin-bottom: 5px;
`

const customStyles = {
    option: (provided, state) => ({
        ...provided,
    }),
    control: (provided) => ({
        ...provided,
        height: 44,
        background: '#e9ecef',
        '&:hover': {
            background: '#dadfe4',
        },
        border: 'none',
        width: 140,
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
