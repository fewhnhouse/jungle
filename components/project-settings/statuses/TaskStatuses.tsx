/* eslint-disable react/display-name */
import { Table, Skeleton } from 'antd'

const { Column } = Table

import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { queryCache, useQuery } from 'react-query'

import {
    getTaskStatuses,
    TaskStatus,
    updateTaskStatus,
} from '../../../taiga-api/tasks'
import EditableColorCell from '../../tablecells/ColorCell'
import EditableInputCell from '../../tablecells/InputCell'
import MoveCell from '../../tablecells/MoveCell'
import SwitchCell from '../../tablecells/SwitchCell'

const TaskStatuses = () => {
    const { projectId } = useRouter().query

    const { data: taskStatuses, isLoading: taskStatusesIsLoading } = useQuery(
        ['taskStatuses', { projectId }],
        async (key, { projectId }) => {
            return (await getTaskStatuses(projectId as string)).sort(
                (a, b) => b.order - a.order
            )
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
                    return prevData
                        ?.map((item) => {
                            if (item.id === updatedStatus.id) {
                                return updatedStatus
                            }
                            return item
                        })
                        .sort((a, b) => a.order - b.order)
                }
            )
        } catch (errInfo) {
            console.log('Save failed:', errInfo)
        }
    }

    useEffect(() => {
        console.log(taskStatuses)
    }, [taskStatuses])

    return (
        <Skeleton loading={taskStatusesIsLoading} active>
            <h2>Task Statuses</h2>
            <Table
                bordered
                dataSource={taskStatuses}
                pagination={false}
            >
                <Column
                    title="Color"
                    dataIndex="color"
                    render={(color: string, record: TaskStatus) => (
                        <EditableColorCell
                            handleSave={handleSave}
                            dataIndex="color"
                            record={record}
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
                            record={record}
                        />
                    )}
                />
                <Column
                    title="Closed"
                    dataIndex="closed"
                    render={(closed: boolean, record: TaskStatus) => (
                        <SwitchCell
                            handleSave={handleSave}
                            dataIndex="closed"
                            record={record}
                        />
                    )}
                />
                <Column
                    title="Move"
                    dataIndex="order"
                    render={(order: number, record: TaskStatus, index) => (
                        <MoveCell
                            handleSave={handleSave}
                            statusItems={taskStatuses}
                            index={index}
                            dataIndex="order"
                            record={record}
                        />
                    )}
                />
            </Table>
        </Skeleton>
    )
}

export default TaskStatuses
