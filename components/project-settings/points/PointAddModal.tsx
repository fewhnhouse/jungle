import { useState } from 'react'
import { useRouter } from 'next/router'
import { useQueryCache } from 'react-query'

import { Button, Form, Input, Modal } from 'antd'
import { Store } from 'antd/lib/form/interface'
import { PlusOutlined } from '@ant-design/icons'
import { createPoint } from '../../../taiga-api/points'
import { Point } from '../../../taiga-api/projects'

const PointAddModal = () => {
    const [show, setShow] = useState(false)
    const { projectId } = useRouter().query
    const queryCache = useQueryCache()

    const [form] = Form.useForm()

    const handleOpen = () => setShow(true)
    const handleClose = () => setShow(false)

    const handleSubmit = async (values: Store) => {
        const point = await createPoint({
            value: values.value,
            project: parseInt(projectId as string, 10),
            name: values.name,
        })
        queryCache.setQueryData(
            ['points', { projectId }],
            (prevData: Point[]) => [...prevData, point]
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
                Add Point
            </Button>
            <Modal
                title="Add Point"
                visible={show}
                onOk={handleFormSubmit}
                onCancel={handleClose}
            >
                <Form layout="vertical" form={form}>
                    <Form.Item
                        rules={[
                            {
                                required: true,
                                message: 'Add a point name',
                            },
                        ]}
                        name="name"
                        label="Point Name"
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        rules={[
                            {
                                required: true,
                                message: 'Add a point value',
                            },
                        ]}
                        name="value"
                        label="Point Value"
                    >
                        <Input type="number" />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
}

export default PointAddModal
