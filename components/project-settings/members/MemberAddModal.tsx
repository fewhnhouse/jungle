import { useState } from 'react'
import { useRouter } from 'next/router'
import { useQueryCache, useQuery } from 'react-query'

import { Button, Form, Input, Modal, Select } from 'antd'
import { Store } from 'antd/lib/form/interface'
import { PlusOutlined } from '@ant-design/icons'
import { getRoles } from '../../../taiga-api/roles'
import { createMembership, Membership } from '../../../taiga-api/memberships'

const MemberAddModal = () => {
    const [show, setShow] = useState(false)
    const [role, setRole] = useState<number | undefined>()
    const { projectId } = useRouter().query
    const queryCache = useQueryCache()

    const { data: roles } = useQuery(
        ['roles', { projectId }],
        async (key, { projectId }) => {
            return await getRoles({ projectId })
        },
        { enabled: projectId }
    )

    const [form] = Form.useForm()

    const onChangeRole = (role: number) => setRole(role)
    const handleOpen = () => setShow(true)
    const handleClose = () => setShow(false)

    const handleSubmit = async (values: Store) => {
        const membership = await createMembership({
            role: values.role,
            project: parseInt(projectId as string, 10),
            username: values.email,
        })
        queryCache.setQueryData(
            ['memberships', { projectId }],
            (prevData: Membership[]) => [...prevData, membership]
        )
        handleClose()
    }

    const handleFormSubmit = () => {
        form.validateFields().then((fields) => {
            form.resetFields()
            handleSubmit(fields)
        })
    }
    return (
        <>
            <Button onClick={handleOpen} icon={<PlusOutlined />}>
                Add Member
            </Button>
            <Modal
                title="Add Member"
                visible={show}
                onOk={handleFormSubmit}
                onCancel={handleClose}
            >
                <Form layout="vertical" form={form}>
                    <Form.Item
                        rules={[
                            {
                                required: true,
                                message:
                                    'Please input an existing username or an email!',
                            },
                        ]}
                        name="email"
                        label="Email or Username"
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        rules={[
                            {
                                required: true,
                                message: 'Please select a role!',
                            },
                        ]}
                        name="role"
                        label="Role"
                    >
                        <Select
                            options={
                                roles?.map((role) => ({
                                    value: role.id,
                                    label: role.name,
                                })) ?? []
                            }
                            value={role}
                            onChange={onChangeRole}
                        />
                    </Form.Item>
                    <Form.Item
                        name="description"
                        label="Invitation Text (optional)"
                    >
                        <Input.TextArea />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
}

export default MemberAddModal
