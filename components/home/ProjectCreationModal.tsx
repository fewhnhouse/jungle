import { useRouter } from 'next/router'
import { addProject, Project } from '../../taiga-api/projects'
import { queryCache } from 'react-query'
import { Form, Input, Modal, Radio } from 'antd'

interface Props {
    open: boolean
    toggle: () => void
}

export default function ProjectCreationModal({ open, toggle }: Props) {
    const { push } = useRouter()

    const handleClose = () => toggle()
    const [form] = Form.useForm()

    const handleSubmit = async (values: {
        name: string
        description: string
        visibility: string
    }) => {
        const { name, description, visibility } = values
        const project = await addProject({
            name,
            description,
            is_private: visibility === 'private',
        })
        queryCache.setQueryData('projects', (prevData: Project[]) => [
            ...prevData,
            project,
        ])
        push('/projects/[id]/settings', `/projects/${project.id}/settings`)
    }

    const handleFormSubmit = () => {
        form.submit()
    }

    return (
        <Modal
            title="Create Project"
            onCancel={handleClose}
            visible={open}
            onOk={handleFormSubmit}
        >
            <Form form={form} onFinish={handleSubmit} layout="vertical">
                <Form.Item name="name" label="Project Name" required>
                    <Input />
                </Form.Item>
                <Form.Item name="description" label="Description">
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
