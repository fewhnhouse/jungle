/* eslint-disable react/display-name */
import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons'
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

import {
    getTaskStatuses,
    TaskStatus,
    updateTaskStatus,
} from '../../taiga-api/tasks'
import { getUserstoryStatuses } from '../../taiga-api/userstories'
import EditableColorCell from '../tablecells/ColorCell'
import EditableInputCell from '../tablecells/InputCell'
import MoveCell from '../tablecells/MoveCell'
import SwitchCell from '../tablecells/SwitchCell'

const Statuses = () => {
    const { projectId } = useRouter().query

    const { data: taskStatuses, isLoading: taskStatusesIsLoading } = useQuery(
        ['taskStatuses', { projectId }],
        async (key, { projectId }) => {
            return (await getTaskStatuses(projectId as string)).sort(
                (a, b) => a.order - b.order
            )
        },
        { enabled: projectId }
    )

    useEffect(() => {
        console.log(taskStatuses)
    }, [taskStatuses])

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
                dataSource={taskStatuses?.sort((a, b) => a.order - b.order)}
                pagination={false}
            >
                <Column
                    title="Color"
                    dataIndex="color"
                    render={(color: string, record: TaskStatus) => (
                        <EditableColorCell dataIndex="color" record={record} />
                    )}
                />
                <Column
                    title="Name"
                    dataIndex="name"
                    render={(name: string, record: TaskStatus) => (
                        <EditableInputCell
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
                        <SwitchCell dataIndex="closed" record={record} />
                    )}
                />
                <Column
                    title="Move"
                    dataIndex="order"
                    render={(order: number, record: TaskStatus, index) => (
                        <MoveCell
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

export default Statuses
