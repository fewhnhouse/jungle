import { Button, SelectPicker } from 'rsuite'
import { SyntheticEvent } from 'react'
import { ItemDataType } from 'rsuite/lib/@types/common'
import styled from 'styled-components'

const StyledSelect = styled(SelectPicker)`
    width: 100%;
`

interface Props {
    onSelect: (
        value: number,
        item: ItemDataType,
        event: SyntheticEvent<HTMLElement, Event>
    ) => void
    data: {
        value: string
        label: string
    }[]
    value: number
}

const StatusDropdown = ({ onSelect, data, value }: Props) => {
    return (
        <StyledSelect
            data={data}
            value={value}
            onSelect={onSelect}
            toggleComponentClass={Button}
            appearance="default"
            title="Select..."
        />
    )
}

export default StatusDropdown
