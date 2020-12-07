import { Switch } from 'antd'
import { useEffect, useState } from 'react'

interface SwitchCellProps {
    dataIndex: string
    record: unknown
    disabled?: boolean
    handleSave: (record: unknown, dataIndex: string, value: any) => void
}

const SwitchCell: React.FC<SwitchCellProps> = ({
    dataIndex,
    record,
    disabled,
    handleSave,
    ...restProps
}) => {
    const [checked, setChecked] = useState(record[dataIndex])
    const onSave = async () => {
        handleSave(record, dataIndex, checked)
    }

    useEffect(() => {
        onSave()
    }, [checked])

    return (
        <td {...restProps}>
            <Switch
                disabled={disabled}
                checked={checked}
                onChange={(checked) => setChecked(checked)}
            />
        </td>
    )
}

export default SwitchCell
