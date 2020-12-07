import { useState } from 'react'
import { useRouter } from 'next/router'
import { useQueryCache, useQuery } from 'react-query'
import {
    createMilestone,
    getMilestones,
    Milestone,
} from '../../taiga-api/milestones'
import { Button, Form, Input, Modal } from 'antd'
import dayjs from 'dayjs'
import { getProject } from '../../taiga-api/projects'
import { Store } from 'antd/lib/form/interface'
import DatePicker from '../DatePicker'
import isBetween from 'dayjs/plugin/isBetween'
import utc from 'dayjs/plugin/utc'
dayjs.extend(isBetween)
dayjs.extend(utc)

const SprintCreation = () => {
    const [show, setShow] = useState(false)
    const [form] = Form.useForm()
    const { projectId } = useRouter().query
    const queryCache = useQueryCache()

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
        const [startDate, endDate]: [dayjs.Dayjs, dayjs.Dayjs] = values.date
        const newMilestone = await createMilestone({
            name: values.name,
            estimated_start: startDate.utc().toISOString().split('T')[0],
            estimated_finish: endDate.utc().toISOString().split('T')[0],
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
                        date: [dayjs.utc(), dayjs.utc().add(14, 'day')],
                        name: `${project?.name} Sprint ${
                            milestones?.length + 1
                        }`,
                    }}
                >
                    <Form.Item
                        rules={[
                            () => ({
                                validator(rule, value: string) {
                                    const isConflictingName = milestones?.some(
                                        (ms) => ms.name === value
                                    )
                                    if (isConflictingName) {
                                        return Promise.reject(
                                            'Please choose a unique name.'
                                        )
                                    } else {
                                        return Promise.resolve()
                                    }
                                },
                            }),
                        ]}
                        required
                        name="name"
                        label="Name"
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        required
                        rules={[
                            () => ({
                                validator(
                                    rule,
                                    value: [dayjs.Dayjs, dayjs.Dayjs]
                                ) {
                                    const startDate = value[0]
                                    const endDate = value[1]
                                    const isConflictingDate = milestones
                                        ?.filter((ms) => !ms.closed)
                                        .some((milestone) => {
                                            return (
                                                startDate.utc().isBetween(
                                                    milestone.estimated_start,
                                                    milestone.estimated_finish
                                                ) ||
                                                endDate.utc().isBetween(
                                                    milestone.estimated_start,
                                                    milestone.estimated_finish
                                                )
                                            )
                                        })
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
                        <DatePicker.RangePicker format="YYYY-MM-DD" />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
}

export default SprintCreation
