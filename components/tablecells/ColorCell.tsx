import { Popover, Tag } from 'antd'
import { useState } from 'react'
import { ChromePicker } from 'react-color'
import { TaskStatus, updateTaskStatus } from '../../taiga-api/tasks'

interface EditableColorCellProps {
    dataIndex: string
    record: TaskStatus
}

const EditableColorCell: React.FC<EditableColorCellProps> = ({
    dataIndex,
    record,
    ...restProps
}) => {
    const [color, setColor] = useState(record[dataIndex])
    const handleSave = async (color: string) => {
        try {
            await updateTaskStatus(record.id, { color })
        } catch (errInfo) {
            console.log('Save failed:', errInfo)
        }
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
                        onChangeComplete={(color) => handleSave(color.hex)}
                        onChange={(color) => setColor(color.hex)}
                        style={{ boxShadow: 'none' }}
                    />
                }
            >
                <Tag color={color}>{color}</Tag>
            </Popover>
        </td>
    )
}

export default EditableColorCell
