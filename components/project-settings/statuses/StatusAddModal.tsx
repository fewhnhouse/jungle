import { useState } from 'react'
import { useRouter } from 'next/router'
import { useQueryCache } from 'react-query'
import { ChromePicker } from 'react-color'

import { Button, Form, Input, Modal, Switch } from 'antd'
import { Store } from 'antd/lib/form/interface'
import { PlusOutlined } from '@ant-design/icons'
import { createTaskStatus, TaskStatus } from '../../../taiga-api/tasks'
import {
    createUserstoryStatus,
    StoryStatus,
} from '../../../taiga-api/userstories'
import useMedia from 'use-media'

const StatusAddModal = ({ type }: { type: 'task' | 'userstory' }) => {
    const [show, setShow] = useState(false)
    const { projectId } = useRouter().query
    const queryCache = useQueryCache()
    const [color, setColor] = useState('#ddd')
    const isMobile = useMedia('(max-width: 700px)')

    const [form] = Form.useForm()

    const handleOpen = () => setShow(true)
    const handleClose = () => setShow(false)

    const handleSubmit = async (values: Store) => {
        if (type === 'task') {
            const taskStatus = await createTaskStatus(
                parseInt(projectId as string, 10),
                {
                    name: values.name,
                    color: color,
                    is_closed: values.is_closed,
                    order: values.order,
                }
            )
            queryCache.setQueryData(
                ['taskStatuses', { projectId }],
                (prevData: TaskStatus[]) => [...prevData, taskStatus]
            )
        } else {
            const storyStatus = await createUserstoryStatus(
                parseInt(projectId as string, 10),
                {
                    name: values.name,
                    color: color,
                    is_closed: values.is_closed,
                    order: values.order,
                }
            )
            queryCache.setQueryData(
                ['userstoryStatuses', { projectId }],
                (prevData: StoryStatus[]) => [...prevData, storyStatus]
            )
        }
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
                Add Status
            </Button>
            <Modal
                title="Add Status"
                visible={show}
                onOk={handleFormSubmit}
                onCancel={handleClose}
            >
                <Form layout="vertical" form={form}>
                    <Form.Item
                        rules={[
                            {
                                required: true,
                                message: 'Add a status name',
                            },
                        ]}
                        name="name"
                        label="Status Name"
                    >
                        <Input size={isMobile ? 'large' : 'middle'} />
                    </Form.Item>
                    <Form.Item name="closed" label="Closed">
                        <Switch />
                    </Form.Item>
                    <Form.Item name="order" label="Order">
                        <Input
                            size={isMobile ? 'large' : 'middle'}
                            type="number"
                        />
                    </Form.Item>

                    <Form.Item name="color" label="Tag Color">
                        <ChromePicker
                            color={color}
                            onChange={(color) => setColor(color.hex)}
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
}

export default StatusAddModal
