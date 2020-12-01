import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { queryCache } from 'react-query'
import { TaskStatus, updateTaskStatus } from '../../taiga-api/tasks'

interface MoveProps {
    dataIndex: string
    record: TaskStatus
    statusItems: TaskStatus[]
    index: number
}

const MoveCell: React.FC<MoveProps> = ({
    dataIndex,
    record,
    statusItems,
    index,
    ...restProps
}) => {
    const { projectId } = useRouter().query
    const [order, setOrder] = useState(record[dataIndex])
    const handleSave = async (order) => {
        try {
            const prevOrder = statusItems[index].order
            const swapItem =
                statusItems[prevOrder < order ? index + 1 : index - 1]
            await updateTaskStatus(swapItem.id, {
                order: prevOrder,
            })
            await updateTaskStatus(record.id, {
                order,
            })
            queryCache.setQueryData(
                ['taskStatuses', { projectId }],
                (prevData: TaskStatus[]) => {
                    const newIndex = prevOrder < order ? index + 1 : index - 1
                    return [...prevData]
                        .map((item, index) => {
                            if (item.id === record.id) {
                                return { ...item, order }
                            } else if (index === newIndex) {
                                return { ...item, order: prevOrder }
                            }
                        })
                        .sort((a, b) => a.order - b.order)
                }
            )
        } catch (errInfo) {
            console.log('Save failed:', errInfo)
        }
    }

    useEffect(() => {
        console.log("handlesave")
        handleSave(order)
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
