import styled from 'styled-components'
import { Select } from 'antd'
import useMedia from 'use-media'

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
    const isMobile = useMedia('(max-width: 700px)')

    return (
        <StyledSelect
            size={isMobile ? 'large' : 'middle'}
            value={value}
            onChange={onChange}
        >
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
