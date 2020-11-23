import { useState } from 'react'
import { useRouter } from 'next/router'
import { queryCache, useQuery } from 'react-query'
import { createUserstory, UserStory } from '../../taiga-api/userstories'
import { getProject } from '../../taiga-api/projects'
import { Button, Form, Input, InputNumber, Modal, Select, Upload } from 'antd'
import { createTask } from '../../taiga-api/tasks'
import { Store } from 'antd/lib/form/interface'

const UserstoryCreation = () => {
    const [show, setShow] = useState(false)
    const { projectId } = useRouter().query
    const [form] = Form.useForm()

    const { data } = useQuery(
        ['project', { projectId }],
        (key, { projectId }) => getProject(projectId as string),
        { enabled: projectId }
    )

    const handleOpen = () => setShow(true)
    const handleClose = () => setShow(false)

    const handleSubmit = async (values: Store) => {
        const { subject, assignee, description, tags, type } = values
        if (type === 'userstory') {
            const newUserstory = await createUserstory({
                subject,
                assigned_to: assignee,
                description,
                tags,
                project: projectId,
            })
            queryCache.setQueryData(
                ['backlog', { projectId }],
                (prevData?: UserStory[]) =>
                    prevData ? [...prevData, newUserstory] : [newUserstory]
            )
        } else if (type === 'task') {
            await createTask({
                subject,
                assigned_to: assignee,
                description,
                tags,
                project: projectId,
            })
            queryCache.invalidateQueries(['tasks', { projectId }])
        }
        handleClose()
    }

    const handleFormSubmit = () => {
        form.validateFields().then((fields: Store) => {
            form.resetFields()
            handleSubmit(fields)
        })
    }
    return (
        <>
            <Button onClick={handleOpen}>Create Issue</Button>
            <Modal
                title="Create Issue"
                visible={show}
                onCancel={handleClose}
                onOk={handleFormSubmit}
            >
                <Form form={form} layout="vertical" onFinish={handleSubmit}>
                    <Form.Item name="type" label="Issue Type">
                        <Select
                            options={[
                                { value: 'userstory', label: 'Userstory' },
                                { value: 'task', label: 'Task' },
                            ]}
                        />
                    </Form.Item>
                    <Form.Item name="subject" label="Subject">
                        <Input />
                    </Form.Item>
                    <Form.Item name="assignee" label="Assignee">
                        <Select
                            options={
                                data?.members.map((member) => ({
                                    value: member.id,
                                    label: member.full_name,
                                })) ?? []
                            }
                        />
                    </Form.Item>
                    <Form.Item name="tags" label="Tags">
                        <Select
                            mode="tags"
                            options={
                                data?.tags.map((tag) => ({
                                    value: tag,
                                    label: tag,
                                })) ?? []
                            }
                        />
                    </Form.Item>
                    <Form.Item label="Description" name="description">
                        <Input.TextArea />
                    </Form.Item>
                    <Form.Item label="Attachments" name="attachments">
                        <Upload.Dragger />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
}

export default UserstoryCreation
