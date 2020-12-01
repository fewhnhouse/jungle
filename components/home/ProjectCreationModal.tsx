import { useRouter } from 'next/router'
import { addProject, Project } from '../../taiga-api/projects'
import { queryCache } from 'react-query'
import { Form, Input, Modal, Radio } from 'antd'
import { Store } from 'antd/lib/form/interface'
import { useState } from 'react'

interface Props {
    open: boolean
    toggle: () => void
}

export default function ProjectCreationModal({ open, toggle }: Props) {
    const { push } = useRouter()

    const handleClose = () => toggle()
    const [isLoading, setIsLoading] = useState(false)
    const [form] = Form.useForm()

    const handleSubmit = async (values: Store) => {
        const { name, description, visibility } = values
        setIsLoading(true)
        try {
            const project = await addProject({
                name,
                description,
                is_private: visibility === 'private',
            })
            queryCache.setQueryData('projects', (prevData: Project[]) =>
                prevData ? [...prevData, project] : [project]
            )
            push(`/projects/${project.id}`)
            toggle()
        } catch (e) {
            console.error(e)
        } finally {
            setIsLoading(false)
        }
    }

    const handleFormSubmit = () => {
        form.validateFields().then((values) => {
            form.resetFields()
            handleSubmit(values)
        })
    }

    return (
        <Modal
            title="Create Project"
            onCancel={handleClose}
            visible={open}
            confirmLoading={isLoading}
            onOk={handleFormSubmit}
        >
            <Form
                form={form}
                layout="vertical"
                initialValues={{ visibility: 'public' }}
            >
                <Form.Item
                    name="name"
                    label="Project Name"
                    required
                    rules={[
                        {
                            required: true,
                            message: 'Please input the Project Name!',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    required
                    rules={[
                        {
                            required: true,
                            message: 'Please add a Description!',
                        },
                    ]}
                    name="description"
                    label="Description"
                >
                    <Input.TextArea />
                </Form.Item>
                <Form.Item label="Visibility" name="visibility">
                    <Radio.Group>
                        <Radio value="public">Public</Radio>
                        <Radio value="private">Private</Radio>
                    </Radio.Group>
                </Form.Item>
            </Form>
        </Modal>
    )
}
