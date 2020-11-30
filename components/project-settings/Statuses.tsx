/* eslint-disable react/display-name */
import {
    ArrowDownOutlined,
    ArrowUpOutlined,
    CheckOutlined,
    CloseOutlined,
    DeleteOutlined,
} from '@ant-design/icons'
import {
    Table,
    Tag,
    Skeleton,
    Input,
    Form,
    Button,
    Popover,
    Switch,
} from 'antd'

const { Column } = Table

import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { queryCache, useQuery } from 'react-query'
import { TwitterPicker, ChromePicker } from 'react-color'

import {
    getTaskStatuses,
    TaskStatus,
    updateTaskStatus,
} from '../../taiga-api/tasks'
import { getUserstoryStatuses } from '../../taiga-api/userstories'

interface EditableCellProps {
    title: React.ReactNode
    dataIndex: string
    record: TaskStatus
}

interface MoveProps {
    dataIndex: string
    record: TaskStatus
    count: number
    index: number
}

const Move: React.FC<MoveProps> = ({
    dataIndex,
    record,
    count,
    index,
    ...restProps
}) => {
    const [order, setOrder] = useState(record[dataIndex])
    const handleSave = async (order) => {
        try {
            await updateTaskStatus(record.id, {
                [dataIndex]: order,
            })
            queryCache.invalidateQueries('taskStatuses')
        } catch (errInfo) {
            console.log('Save failed:', errInfo)
        }
    }

    useEffect(() => {
        handleSave(order)
    }, [order])

    const increment = () => setOrder((order) => order + 1)
    const decrement = () => setOrder((order) => order - 1)

    return (
        <td {...restProps}>
            <Button
                disabled={index <= 0}
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

const EditableSwitch: React.FC<EditableCellProps> = ({
    title,
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

const EditableCell: React.FC<EditableCellProps> = ({
    title,
    dataIndex,
    record,
    ...restProps
}) => {
    const [form] = Form.useForm()

    const handleSave = async () => {
        try {
            const values = await form.validateFields()

            await updateTaskStatus(record.id, {
                [dataIndex]: values[dataIndex],
            })
        } catch (errInfo) {
            console.log('Save failed:', errInfo)
        }
    }

    return (
        <td {...restProps}>
            <Form
                form={form}
                onFinish={handleSave}
                initialValues={{ [dataIndex]: record[dataIndex] }}
            >
                <Form.Item
                    style={{ margin: 0 }}
                    name={dataIndex}
                    rules={[
                        {
                            required: true,
                            message: `${title} is required.`,
                        },
                    ]}
                >
                    <Input
                        onPressEnter={handleSave}
                        onBlur={handleSave}
                        bordered={false}
                    />
                </Form.Item>
            </Form>
        </td>
    )
}

const EditableTag: React.FC<EditableCellProps> = ({
    dataIndex,
    record,
    ...restProps
}) => {
    const [form] = Form.useForm()
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

const Statuses = () => {
    const { query, replace } = useRouter()
    const { projectId } = query

    const { data: taskStatuses, isLoading: taskStatusesIsLoading } = useQuery(
        ['taskStatuses', { projectId }],
        async (key, { projectId }) => {
            return getTaskStatuses(projectId as string)
        },
        { enabled: projectId }
    )
    const {
        data: userstoryStatuses,
        isLoading: userstoryStatusesIsLoading,
    } = useQuery(
        ['userstoryStatuses', { projectId }],
        async (key, { projectId }) => {
            return getUserstoryStatuses(projectId as string)
        },
        { enabled: projectId }
    )

    return (
        <Skeleton
            loading={taskStatusesIsLoading || userstoryStatusesIsLoading}
            active
        >
            <Table
                bordered
                dataSource={taskStatuses}
                pagination={false}
                sorter={(a, b) => a.order - b.order}
            >
                <Column
                    title="Color"
                    dataIndex="color"
                    render={(color: string, record: any) => (
                        <EditableTag
                            dataIndex="color"
                            title="Color"
                            record={record}
                        />
                    )}
                />
                <Column
                    title="Name"
                    dataIndex="name"
                    render={(name: string, record: any) => (
                        <EditableCell
                            dataIndex="name"
                            title="Name"
                            record={record}
                        />
                    )}
                />
                <Column
                    title="Closed"
                    dataIndex="closed"
                    render={(closed: boolean, record: any) => (
                        <EditableSwitch
                            dataIndex="closed"
                            title="Closed"
                            record={record}
                        />
                    )}
                />
                <Column
                    title="Move"
                    dataIndex="order"
                    render={(order: number, record: any, index) => (
                        <Move
                            index={index}
                            count={taskStatuses?.length}
                            dataIndex="order"
                            record={record}
                        />
                    )}
                />
            </Table>
        </Skeleton>
    )
}

export default Statuses
