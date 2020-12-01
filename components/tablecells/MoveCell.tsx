import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import { useEffect, useState } from 'react'
import { TaskStatus } from '../../taiga-api/tasks'
import { UserstoryStatus } from '../../taiga-api/userstories'

interface MoveProps {
    dataIndex: string
    record: TaskStatus | UserstoryStatus
    statusItems: (TaskStatus | UserstoryStatus)[]
    index: number
    handleSave: (record: TaskStatus | UserstoryStatus, dataIndex: string, value: any) => void
}

const MoveCell: React.FC<MoveProps> = ({
    dataIndex,
    record,
    statusItems,
    index,
    handleSave,
    ...restProps
}) => {
    const [order, setOrder] = useState(record[dataIndex])
    const onSave = (order) => {
        const prevOrder = statusItems[index].order
        const swapItem = statusItems[prevOrder < order ? index + 1 : index - 1]
        handleSave(swapItem, dataIndex, prevOrder)
        handleSave(record, dataIndex, order)
    }

    useEffect(() => {
        console.log('handlesave')
        onSave(order)
    }, [order])

    const increment = () => setOrder((order) => order + 1)
    const decrement = () => setOrder((order) => order - 1)
    const count = statusItems.length

    return (
        <td {...restProps}>
            <Button
                disabled={index === 0 && order === 0}
                onClick={decrement}
                icon={<ArrowUpOutlined />}
            />
            <Button
                disabled={index >= count - 1}
                onClick={increment}
                icon={<ArrowDownOutlined />}
            />
        </td>
    )
}

export default MoveCell
