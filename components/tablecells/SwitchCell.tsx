import { Switch } from 'antd'
import { useEffect, useState } from 'react'
import { TaskStatus } from '../../taiga-api/tasks'
import { UserstoryStatus } from '../../taiga-api/userstories'

interface SwitchCellProps {
    dataIndex: string
    record: TaskStatus | UserstoryStatus
    handleSave: (record: TaskStatus | UserstoryStatus, dataIndex: string, value: any) => void
}

const SwitchCell: React.FC<SwitchCellProps> = ({
    dataIndex,
    record,
    handleSave,
    ...restProps
}) => {
    const [closed, setClosed] = useState(record[dataIndex])
    const onSave = async () => {
        handleSave(record, dataIndex, closed)
    }

    useEffect(() => {
        onSave()
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
