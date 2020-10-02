import { useState } from 'react'
import { useRouter } from 'next/router'
import { queryCache } from 'react-query'
import { createMilestone, Milestone } from '../../taiga-api/milestones'
import { Button, DatePicker, Form, Input, Modal } from 'antd'

const SprintCreation = () => {
    const [show, setShow] = useState(false)
    const [form] = Form.useForm()
    const { projectId } = useRouter().query

    const handleOpen = () => setShow(true)
    const handleClose = () => setShow(false)

    const handleSubmit = async (values: { name: string; date: [any, any] }) => {
        const startDate = values.date[0]
        const endDate = values.date[1]
        const newMilestone = await createMilestone({
            name: values.name,
            estimated_start: startDate._d.toISOString().split('T')[0],
            estimated_finish: endDate._d.toISOString().split('T')[0],
            project: projectId,
        })
        queryCache.setQueryData('milestones', (oldMilestones?: Milestone[]) =>
            oldMilestones ? [...oldMilestones, newMilestone] : [newMilestone]
        )
        handleClose()
    }

    const handleFormSubmit = () => {
        form.submit()
    }
    return (
        <>
            <Button onClick={handleOpen}>Create Sprint</Button>
            <Modal
                title="Create Sprint"
                visible={show}
                onOk={handleFormSubmit}
                onCancel={handleClose}
            >
                <Form layout="vertical" form={form} onFinish={handleSubmit}>
                    <Form.Item required name="name" label="Name">
                        <Input />
                    </Form.Item>
                    <Form.Item required name="date" label="Duration">
                        <DatePicker.RangePicker />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
}

export default SprintCreation
