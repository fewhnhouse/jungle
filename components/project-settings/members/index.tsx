/* eslint-disable react/display-name */
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons'
import { Table, Skeleton, Button, Popconfirm } from 'antd'

const { Column } = Table

import { useRouter } from 'next/router'
import { useQueryCache, useQuery } from 'react-query'
import {
    deleteMembership,
    getMemberships,
    Membership,
    updateMembership,
} from '../../../taiga-api/memberships'
import { Member } from '../../../taiga-api/projects'
import { getRoles } from '../../../taiga-api/roles'
import Flex from '../../Flex'

import MemberCell from '../../tablecells/MemberCell'
import SelectCell from '../../tablecells/SelectCell'
import SwitchCell from '../../tablecells/SwitchCell'
import MemberAddModal from './MemberAddModal'

const Members = () => {
    const { projectId } = useRouter().query
    const queryCache = useQueryCache()

    const { data: memberships, isLoading } = useQuery(
        ['memberships', { projectId }],
        (key, { projectId }) => {
            return getMemberships(projectId as string)
        },
        { enabled: projectId }
    )

    const { data: roles } = useQuery(
        ['roles', { projectId }],
        async (key, { projectId }) => {
            return await getRoles({ projectId })
        },
        { enabled: projectId }
    )

    const handleSave = async (
        record: Membership,
        dataIndex: string,
        value: unknown
    ) => {
        try {
            const updatedMembership = await updateMembership(
                record.id.toString(),
                {
                    [dataIndex]: value,
                }
            )
            queryCache.setQueryData(
                ['memberships', { projectId }],
                (prevData: Membership[]) => {
                    return prevData?.map((item) => {
                        if (item.id === updatedMembership.id) {
                            return { ...item, ...updatedMembership }
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
            ['memberships', { projectId }],
            (prevData: Membership[]) => prevData.filter((m) => m.id !== id)
        )
        deleteMembership(id)
    }


    return (
        <Skeleton loading={isLoading} active>
            <Flex justify="space-between" style={{ width: '100%' }}>
                <h2>Members</h2>
                <MemberAddModal />
            </Flex>
            <Table bordered dataSource={memberships} pagination={false}>
                <Column
                    title="Name"
                    dataIndex="name"
                    render={(name: string, record: Member) => (
                        <MemberCell
                            record={record as any}
                            usernameIndex="username"
                            fullnameIndex="full_name"
                            emailIndex="email"
                            avatarIndex="photo"
                        />
                    )}
                />
                <Column
                    title="Admin"
                    dataIndex="is_admin"
                    render={(active: boolean, record: any) => (
                        <SwitchCell
                            disabled={record.is_owner}
                            handleSave={handleSave}
                            dataIndex="is_admin"
                            record={record}
                        />
                    )}
                />
                <Column
                    title="Role"
                    dataIndex="role"
                    render={(role: number, record: any) => (
                        <SelectCell
                            options={
                                roles?.map((role) => ({
                                    value: role.id,
                                    label: role.name,
                                })) ?? []
                            }
                            handleSave={handleSave}
                            dataIndex="role"
                            record={record}
                        />
                    )}
                />
                <Column
                    title="Active"
                    dataIndex="is_user_active"
                    render={(active: boolean, record: any) => (
                        <SwitchCell
                            disabled={record.is_owner}
                            handleSave={handleSave}
                            dataIndex="is_user_active"
                            record={record}
                        />
                    )}
                />
                <Column
                    title="Action"
                    render={(role: number, record: any) => (
                        <Popconfirm
                            title={`Are you sure you want to remove ${
                                record.username ?? record.full_name
                            }?`}
                            onConfirm={handleDelete(record.id)}
                        >
                            <Button
                                disabled={record.is_owner}
                                danger
                                icon={<DeleteOutlined />}
                            />
                        </Popconfirm>
                    )}
                />
            </Table>
        </Skeleton>
    )
}

export default Members
