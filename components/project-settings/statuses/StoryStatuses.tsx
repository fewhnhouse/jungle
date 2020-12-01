/* eslint-disable react/display-name */
import { Table, Skeleton } from 'antd'

const { Column } = Table

import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useQueryCache, useQuery } from 'react-query'

import {
    getUserstoryStatuses,
    updateUserstoryStatus,
    UserstoryStatus,
} from '../../../taiga-api/userstories'
import EditableColorCell from '../../tablecells/ColorCell'
import EditableInputCell from '../../tablecells/InputCell'
import MoveCell from '../../tablecells/MoveCell'
import SwitchCell from '../../tablecells/SwitchCell'

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

    return (
        <Skeleton loading={userstoryStatusesIsLoading} active>
            <h2>Userstory Statuses</h2>
            <Table bordered dataSource={userstoryStatuses} pagination={false}>
                <Column
                    title="Color"
                    dataIndex="color"
                    render={(color: string, record: UserstoryStatus) => (
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
                    render={(name: string, record: UserstoryStatus) => (
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
                    render={(closed: boolean, record: UserstoryStatus) => (
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
                    defaultSortOrder="descend"
                    render={(order: number, record: UserstoryStatus, index) => (
                        <MoveCell
                            handleSave={handleSave}
                            statusItems={userstoryStatuses}
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

export default StoryStatuses
