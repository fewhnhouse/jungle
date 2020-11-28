import { useState } from 'react'
import { useRouter } from 'next/router'
import { queryCache, useQuery } from 'react-query'
import {
    createUserstory,
    createUserstoryAttachment,
    UserStory,
} from '../../taiga-api/userstories'
import { getProject, getTagColors } from '../../taiga-api/projects'
import { Button, Form, Input, Modal, Select, Tag, Upload } from 'antd'
import { createTask, createTaskAttachment, Task } from '../../taiga-api/tasks'
import { Store } from 'antd/lib/form/interface'
import { RcFile } from 'antd/lib/upload'

const IssueCreationModal = () => {
    const [show, setShow] = useState(false)
    const { projectId } = useRouter().query
    const [form] = Form.useForm()
    const [fileList, setFileList] = useState<RcFile[]>([])

    const { data } = useQuery(
        ['project', { projectId }],
        (key, { projectId }) => getProject(projectId as string),
        { enabled: projectId }
    )

    const { data: tags } = useQuery(
        ['tags', { projectId }],
        (key, { projectId }) => getTagColors(projectId as string)
    )

    const tagsArray = tags
        ? Object.keys(tags).map((key) => ({
              label: key,
              value: key,
              color: tags[key],
          }))
        : []

    const handleOpen = () => setShow(true)
    const handleClose = () => setShow(false)

    const handleUpload = async (type: 'task' | 'userstory', id: number) => {
        await Promise.all(
            fileList.map(async (file) => {
                const formData = new FormData()
                formData.append('project', projectId as string)
                formData.append('object_id', id.toString())
                formData.append('attached_file', file)
                if (type === 'task') {
                    return await createTaskAttachment(formData)
                } else if (type === 'userstory') {
                    return await createUserstoryAttachment(formData)
                }
            })
        )
        setFileList([])
    }

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
            handleUpload(type, newUserstory.id)
            queryCache.setQueryData(
                ['userstories', { projectId }],
                (prevData?: UserStory[]) =>
                    prevData ? [...prevData, newUserstory] : [newUserstory]
            )
        } else if (type === 'task') {
            const newTask = await createTask({
                subject,
                assigned_to: assignee,
                description,
                tags,
                project: projectId,
            })
            handleUpload(type, newTask.id)
            queryCache.setQueryData(
                ['tasks', { projectId }],
                (prevData?: Task[]) =>
                    prevData ? [...prevData, newTask] : [newTask]
            )
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
                <Form
                    form={form}
                    initialValues={{ type: 'userstory' }}
                    layout="vertical"
                    onFinish={handleSubmit}
                >
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
                            options={tagsArray}
                            tagRender={({ label }) => {
                                return <Tag>{label}</Tag>
                            }}
                            mode="tags"
                        />
                    </Form.Item>
                    <Form.Item label="Description" name="description">
                        <Input.TextArea />
                    </Form.Item>
                    <Form.Item label="Attachments" name="attachments">
                        <Upload.Dragger
                            onRemove={(file) => {
                                setFileList((fileList) => {
                                    const index = fileList.findIndex(
                                        (f) => f.uid === file.uid
                                    )
                                    const newFileList = fileList.slice()
                                    newFileList.splice(index, 1)
                                    return newFileList
                                })
                            }}
                            beforeUpload={(file) => {
                                console.log(file)
                                setFileList((fileList) => [...fileList, file])
                                return false
                            }}
                            fileList={fileList}
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
}

export default IssueCreationModal
