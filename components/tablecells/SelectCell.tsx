import { Select } from 'antd'
import { useEffect, useState } from 'react'

interface SwitchCellProps {
    dataIndex: string
    record: unknown
    options: { value: string | number; label: string }[]
    handleSave: (record: unknown, dataIndex: string, value: any) => void
}

const SelectCell: React.FC<SwitchCellProps> = ({
    dataIndex,
    record,
    options,
    handleSave,
    ...restProps
}) => {
    const [value, setValue] = useState(record[dataIndex])

    const onChange = (value: number | string) => {
        setValue(value)
        handleSave(record, dataIndex, value)
    }

    return (
        <td {...restProps}>
            <Select
                style={{ width: 120 }}
                options={options}
                value={value}
                onChange={onChange}
            />
        </td>
    )
}

export default SelectCell
