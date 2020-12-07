/* eslint-disable react/display-name */
import { DeleteOutlined } from '@ant-design/icons'
import { Table, Skeleton, Popconfirm, Button } from 'antd'

const { Column } = Table

import { useRouter } from 'next/router'
import { useQueryCache, useQuery } from 'react-query'

import {
    deleteTaskStatus,
    getTaskStatuses,
    TaskStatus,
    updateTaskStatus,
} from '../../../taiga-api/tasks'
import Flex from '../../Flex'
import EditableColorCell from '../../tablecells/ColorCell'
import EditableInputCell from '../../tablecells/InputCell'
import SwitchCell from '../../tablecells/SwitchCell'
import StatusAddModal from './StatusAddModal'

const TaskStatuses = () => {
    const { projectId } = useRouter().query
    const queryCache = useQueryCache()

    const { data: taskStatuses, isLoading: taskStatusesIsLoading } = useQuery(
        ['taskStatuses', { projectId }],
        async (key, { projectId }) => {
            return await getTaskStatuses(projectId as string)
        },
        { enabled: projectId }
    )

    const handleSave = async (
        record: TaskStatus,
        dataIndex: string,
        value: unknown
    ) => {
        try {
            const updatedStatus = await updateTaskStatus(record.id, {
                [dataIndex]: value,
            })
            queryCache.setQueryData(
                ['taskStatuses', { projectId }],
                (prevData: TaskStatus[]) => {
                    return prevData?.map((item) => {
                        if (item.id === updatedStatus.id) {
                            return updatedStatus
                        }
                        return item
                    })
                }
            )
        } catch (errInfo) {
            console.error('Save failed:', errInfo)
        }
    }

    const handleDelete = (id: number) => () => {
        queryCache.setQueryData(
            ['taskStatuses', { projectId }],
            (prevData: TaskStatus[]) => {
                return prevData?.filter((item) => item.id !== id)
            }
        )
        deleteTaskStatus(id)
    }

    return (
        <Skeleton loading={taskStatusesIsLoading} active>
            <Flex style={{ width: '100%' }} justify="space-between">
                <h2>Task Statuses</h2>
                <StatusAddModal type="task" />
            </Flex>
            <Table bordered dataSource={taskStatuses} pagination={false}>
                <Column
                    title="Color"
                    dataIndex="color"
                    render={(color: string, record: TaskStatus) => (
                        <EditableColorCell
                            handleSave={handleSave}
                            dataIndex="color"
                            record={record as any}
                        />
                    )}
                />
                <Column
                    title="Name"
                    dataIndex="name"
                    render={(name: string, record: TaskStatus) => (
                        <EditableInputCell
                            handleSave={handleSave}
                            dataIndex="name"
                            title="Name"
                            record={record as any}
                        />
                    )}
                />
                <Column
                    title="Closed"
                    dataIndex="is_closed"
                    render={(closed: boolean, record: TaskStatus) => (
                        <SwitchCell
                            handleSave={handleSave}
                            dataIndex="is_closed"
                            record={record}
                        />
                    )}
                />
                <Column
                    title="Order"
                    dataIndex="order"
                    defaultSortOrder="descend"
                    sortDirections={['descend']}
                    render={(order: number, record: TaskStatus, index) => (
                        // <MoveCell
                        //     handleSave={handleSave}
                        //     statusItems={taskStatuses}
                        //     index={index}
                        //     dataIndex="order"
                        //     record={record}
                        // />
                        <EditableInputCell
                            type="number"
                            record={record as any}
                            dataIndex="order"
                            handleSave={handleSave}
                            title="Order"
                        />
                    )}
                />
                <Column
                    title="Action"
                    render={(role: number, record: TaskStatus) => (
                        <Popconfirm
                            title={`Are you sure you want to remove this point?`}
                            onConfirm={handleDelete(record.id)}
                        >
                            <Button danger icon={<DeleteOutlined />} />
                        </Popconfirm>
                    )}
                />
            </Table>
        </Skeleton>
    )
}

export default TaskStatuses
