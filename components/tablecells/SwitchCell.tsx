import { Switch } from 'antd'
import { useEffect, useState } from 'react'
import { TaskStatus, updateTaskStatus } from '../../taiga-api/tasks'

interface SwitchCellProps {
    dataIndex: string
    record: TaskStatus
}

const SwitchCell: React.FC<SwitchCellProps> = ({
    dataIndex,
    record,
    ...restProps
}) => {
    const [closed, setClosed] = useState(record[dataIndex])
    const handleSave = async () => {
        try {
            await updateTaskStatus(record.id, {
                [dataIndex]: closed,
            })
        } catch (errInfo) {
            console.log('Save failed:', errInfo)
        }
    }

    useEffect(() => {
        handleSave()
    }, [closed])

    return (
        <td {...restProps}>
            <Switch
                checked={closed}
                onChange={(checked) => setClosed(checked)}
            />
        </td>
    )
}

export default SwitchCell
