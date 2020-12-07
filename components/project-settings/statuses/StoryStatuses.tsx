/* eslint-disable react/display-name */
import { DeleteOutlined } from '@ant-design/icons'
import { Table, Skeleton, Popconfirm, Button } from 'antd'

const { Column } = Table

import { useRouter } from 'next/router'
import { useQueryCache, useQuery } from 'react-query'

import {
    deleteUserstoryStatus,
    getUserstoryStatuses,
    updateUserstoryStatus,
    UserstoryStatus,
} from '../../../taiga-api/userstories'
import Flex from '../../Flex'
import EditableColorCell from '../../tablecells/ColorCell'
import EditableInputCell from '../../tablecells/InputCell'
import SwitchCell from '../../tablecells/SwitchCell'
import StatusAddModal from './StatusAddModal'

const StoryStatuses = () => {
    const { projectId } = useRouter().query
    const queryCache = useQueryCache()

    const {
        data: userstoryStatuses,
        isLoading: userstoryStatusesIsLoading,
    } = useQuery(
        ['userstoryStatuses', { projectId }],
        async (key, { projectId }) => {
            return await getUserstoryStatuses(projectId as string)
        },
        { enabled: projectId }
    )

    const handleSave = async (
        record: UserstoryStatus,
        dataIndex: string,
        value: unknown
    ) => {
        try {
            const updatedStatus = await updateUserstoryStatus(record.id, {
                [dataIndex]: value,
            })
            queryCache.setQueryData(
                ['userstoryStatuses', { projectId }],
                (prevData: UserstoryStatus[]) => {
                    return prevData?.map((item) => {
                        if (item.id === updatedStatus.id) {
                            return updatedStatus
                        }
                        return item
                    })
                }
            )
        } catch (errInfo) {
            console.log('Save failed:', errInfo)
        }
    }
    const handleDelete = (id: number) => () => {
        queryCache.setQueryData(
            ['userstoryStatuses', { projectId }],
            (prevData: UserstoryStatus[]) => {
                return prevData?.filter((item) => item.id !== id)
            }
        )
        deleteUserstoryStatus(id)
    }

    return (
        <Skeleton loading={userstoryStatusesIsLoading} active>
            <Flex style={{ width: '100%' }} justify="space-between">
                <h2>Userstory Statuses</h2>
                <StatusAddModal type="userstory" />
            </Flex>
            <Table bordered dataSource={userstoryStatuses} pagination={false}>
                <Column
                    title="Color"
                    dataIndex="color"
                    render={(color: string, record: UserstoryStatus) => (
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
                    render={(name: string, record: UserstoryStatus) => (
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
                    render={(closed: boolean, record: UserstoryStatus) => (
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
                    render={(order: number, record: UserstoryStatus, index) => (
                        // <MoveCell
                        //     handleSave={handleSave}
                        //     statusItems={userstoryStatuses}
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
                    render={(role: number, record: UserstoryStatus) => (
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

export default StoryStatuses
