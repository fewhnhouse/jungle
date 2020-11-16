import { useState } from 'react'
import { useRouter } from 'next/router'
import { queryCache, useQuery } from 'react-query'
import {
    createMilestone,
    getMilestones,
    Milestone,
} from '../../taiga-api/milestones'
import { Button, DatePicker, Form, Input, Modal } from 'antd'
import moment from 'moment'
import { getProject } from '../../taiga-api/projects'
import { Store } from 'antd/lib/form/interface'

const SprintCreation = () => {
    const [show, setShow] = useState(false)
    const [form] = Form.useForm()
    const { projectId } = useRouter().query

    const { data: project } = useQuery(
        ['project', { projectId }],
        (key, { projectId }) => getProject(projectId as string),
        { enabled: projectId }
    )

    const { data: milestones } = useQuery(
        ['milestones', { projectId }],
        async (key, { projectId }) => {
            return getMilestones({
                closed: false,
                projectId: projectId as string,
            })
        },
        { enabled: projectId }
    )

    const handleOpen = () => setShow(true)
    const handleClose = () => setShow(false)

    const handleSubmit = async (values: Store) => {
        const startDate = values.date[0]
        const endDate = values.date[1]
        const newMilestone = await createMilestone({
            name: values.name,
            estimated_start: startDate._d.toISOString().split('T')[0],
            estimated_finish: endDate._d.toISOString().split('T')[0],
            project: projectId,
        })
        queryCache.setQueryData(
            ['milestones', { projectId }],
            (oldMilestones?: Milestone[]) =>
                oldMilestones
                    ? [...oldMilestones, newMilestone]
                    : [newMilestone]
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
            <Button onClick={handleOpen}>Create Sprint</Button>
            <Modal
                title="Create Sprint"
                visible={show}
                onOk={handleFormSubmit}
                onCancel={handleClose}
            >
                <Form
                    layout="vertical"
                    form={form}
                    initialValues={{
                        date: [moment(), moment().add(14, 'days')],
                        name: `${project?.name} Sprint ${
                            milestones?.length + 1
                        }`,
                    }}
                >
                    <Form.Item required name="name" label="Name">
                        <Input />
                    </Form.Item>
                    <Form.Item
                        required
                        rules={[
                            ({ getFieldValue }) => ({
                                validator(
                                    rule,
                                    value: [moment.Moment, moment.Moment]
                                ) {
                                    console.log(value)
                                    const startDate = value[0]
                                    const endDate = value[1]
                                    const isConflictingDate = milestones
                                        ?.filter((ms) => !ms.closed)
                                        .some((milestone) => {
                                            return (
                                                startDate.isBetween(
                                                    milestone.estimated_start,
                                                    milestone.estimated_finish
                                                ) ||
                                                endDate.isBetween(
                                                    milestone.estimated_start,
                                                    milestone.estimated_finish
                                                )
                                            )
                                        })
                                    console.log(isConflictingDate)
                                    if (isConflictingDate) {
                                        return Promise.reject(
                                            `The selected Date Range is colliding with another Sprint!`
                                        )
                                    } else {
                                        return Promise.resolve()
                                    }
                                },
                            }),
                        ]}
                        name="date"
                        label="Duration"
                    >
                        <DatePicker.RangePicker />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
}

export default SprintCreation
