/* eslint-disable react/display-name */
import { DeleteOutlined } from '@ant-design/icons'
import { Table, Skeleton, Button, Popconfirm } from 'antd'

const { Column } = Table

import { useRouter } from 'next/router'
import { useQueryCache, useQuery } from 'react-query'
import { deletePoint, getPoints, updatePoint } from '../../../taiga-api/points'
import { Point } from '../../../taiga-api/projects'
import Flex from '../../Flex'
import EditableInputCell from '../../tablecells/InputCell'

import PointAddModal from './PointAddModal'

const Points = () => {
    const { projectId } = useRouter().query
    const queryCache = useQueryCache()

    const { data: points, isLoading } = useQuery(
        ['points', { projectId }],
        (key, { projectId }) => {
            return getPoints(projectId as string)
        },
        { enabled: projectId }
    )

    const handleSave = async (
        record: Point,
        dataIndex: string,
        value: unknown
    ) => {
        try {
            const updatedPoint = await updatePoint(record.id.toString(), {
                [dataIndex]: value,
            })
            queryCache.setQueryData(
                ['points', { projectId }],
                (prevData: Point[]) => {
                    return prevData?.map((item) => {
                        if (item.id === updatedPoint.id) {
                            return { ...item, ...updatedPoint }
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
            ['points', { projectId }],
            (prevData: Point[]) => prevData.filter((m) => m.id !== id)
        )
        deletePoint(id)
    }

    return (
        <Skeleton loading={isLoading} active>
            <Flex justify="space-between" style={{ width: '100%' }}>
                <h2>Points</h2>
                <PointAddModal />
            </Flex>
            <Table bordered dataSource={points} pagination={false}>
                <Column
                    title="Name"
                    dataIndex="name"
                    render={(name: string, record: Point) => (
                        <EditableInputCell
                            record={record as any}
                            title="Name"
                            dataIndex="name"
                            handleSave={handleSave}
                        />
                    )}
                />
                <Column
                    title="Value"
                    dataIndex="value"
                    render={(name: string, record: Point) => (
                        <EditableInputCell
                            type="number"
                            record={record as any}
                            title="Value"
                            dataIndex="value"
                            handleSave={handleSave}
                        />
                    )}
                />
                <Column
                    title="Action"
                    render={(role: number, record: Point) => (
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

export default Points
