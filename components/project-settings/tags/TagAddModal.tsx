import { useState } from 'react'
import { useRouter } from 'next/router'
import { useQueryCache } from 'react-query'
import { ChromePicker } from 'react-color'

import { Button, Form, Input, Modal } from 'antd'
import { Store } from 'antd/lib/form/interface'
import { PlusOutlined } from '@ant-design/icons'
import { createPoint } from '../../../taiga-api/points'
import { Point } from '../../../taiga-api/projects'
import { createTag, Tag } from '../../../taiga-api/tags'

const PointAddModal = () => {
    const [show, setShow] = useState(false)
    const { projectId } = useRouter().query
    const queryCache = useQueryCache()
    const [color, setColor] = useState('#ddd')

    const [form] = Form.useForm()

    const handleOpen = () => setShow(true)
    const handleClose = () => setShow(false)

    const handleSubmit = async (values: Store) => {
        await createTag(projectId as string, {
            color,
            tag: values.name,
        })
        queryCache.setQueryData(
            ['tags', { projectId }],
            (prevData: Tag[]) => [...prevData, { color, name: values.name }]
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
                Add Tag
            </Button>
            <Modal
                width="275px"
                title="Add Tag"
                visible={show}
                onOk={handleFormSubmit}
                onCancel={handleClose}
            >
                <Form layout="vertical" form={form}>
                    <Form.Item
                        rules={[
                            {
                                required: true,
                                message: 'Add a tag name',
                            },
                        ]}
                        name="name"
                        label="Tag Name"
                    >
                        <Input />
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

export default PointAddModal
