import styled from 'styled-components'
import { Select } from 'antd'

const StyledSelect = styled(Select)`
    width: 100%;
`

interface Props {
    onChange: (value: number) => void
    data: {
        value: number
        label: string
    }[]
    value: number
}

const StatusDropdown = ({ onChange, data, value }: Props) => {
    return (
        <StyledSelect value={value} onChange={onChange}>
            {data?.map((item) => (
                <Select.Option
                    title={item.label}
                    key={item.value}
                    value={item.value}
                >
                    {item.label}
                </Select.Option>
            ))}
        </StyledSelect>
    )
}

export default StatusDropdown
