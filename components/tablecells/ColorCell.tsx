import { Popover, Tag } from 'antd'
import { useState } from 'react'
import { ChromePicker } from 'react-color'

interface EditableColorCellProps {
    dataIndex: string
    record: { [key: string]: unknown }
    handleSave: (record: any, dataIndex: string, value: any) => void
}

const EditableColorCell: React.FC<EditableColorCellProps> = ({
    dataIndex,
    record,
    handleSave,
    ...restProps
}) => {
    const [color, setColor] = useState(record[dataIndex] ?? '#ddd')
    const onSave = async (color: string) => {
        handleSave(record, dataIndex, color)
    }

    return (
        <td {...restProps}>
            <Popover
                trigger="click"
                overlayStyle={{ padding: 0 }}
                overlayInnerStyle={{ padding: 0 }}
                content={
                    <ChromePicker
                        color={color}
                        onChangeComplete={(color) => onSave(color.hex)}
                        onChange={(color) => setColor(color.hex)}
                        style={{ boxShadow: 'none' }}
                    />
                }
            >
                <Tag color={color as string}>{color}</Tag>
            </Popover>
        </td>
    )
}

export default EditableColorCell
