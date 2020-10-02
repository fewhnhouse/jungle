import { useState } from 'react'
import { useRouter } from 'next/router'
import { queryCache, useQuery } from 'react-query'
import { createUserstory, UserStory } from '../../taiga-api/userstories'
import { getProject } from '../../taiga-api/projects'
import { Button, Form, Input, InputNumber, Modal, Select, Upload } from 'antd'

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

    const handleSubmit = async (values: {
        subject: string
        assignee: number
        description: string
        tags: string[]
    }) => {
        const { subject, assignee, description, tags } = values
        const newUserstory = await createUserstory({
            subject,
            assigned_to: assignee,
            description,
            tags,
            project: projectId,
        })
        queryCache.setQueryData('backlog', (prevData?: UserStory[]) =>
            prevData ? [...prevData, newUserstory] : [newUserstory]
        )
        handleClose()
    }

    const handleFormSubmit = () => {
        form.submit()
    }
    return (
        <>
            <Button onClick={handleOpen}>Create Userstory</Button>
            <Modal
                title="Create Userstory"
                visible={show}
                onCancel={handleClose}
                onOk={handleFormSubmit}
            >
                <Form form={form} layout="vertical" onFinish={handleSubmit}>
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
                    <Form.Item label="Story Points" name="storyPoints">
                        <InputNumber />
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
