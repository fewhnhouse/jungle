import { DatePicker, Form, Input, Modal } from 'antd'
import { Store } from 'antd/lib/form/interface'
import moment from 'moment'
import { useRouter } from 'next/router'
import { queryCache, useQuery } from 'react-query'
import {
    getMilestones,
    Milestone,
    updateMilestone,
} from '../../taiga-api/milestones'

interface Props {
    open: boolean
    sprint: Milestone
    onClose: () => void
}
const EditSprint = ({ open, sprint, onClose }: Props) => {
    const [form] = Form.useForm()
    const { projectId } = useRouter().query

    const { data: milestones } = useQuery(
        ['milestones', { projectId }],
        (key, { projectId }) => {
            return getMilestones({
                closed: false,
                projectId: projectId as string,
            })
        },
        { enabled: projectId }
    )

    const otherMilestones = milestones.filter((ms) => ms.id !== sprint.id)
    const handleSubmit = async (values: Store) => {
        const startDate = values.date[0]
        const endDate = values.date[1]
        const newMilestone = await updateMilestone(sprint.id, {
            name: values.name,
            estimated_start: startDate._d.toISOString().split('T')[0],
            estimated_finish: endDate._d.toISOString().split('T')[0],
        })
        queryCache.setQueryData(
            ['milestones', { projectId }],
            (oldMilestones?: Milestone[]) =>
                oldMilestones.map((ms) =>
                    ms.id === sprint.id ? newMilestone : ms
                )
        )
        onClose()
    }

    const handleFormSubmit = () => {
        form.validateFields().then((fields) => {
            form.resetFields()
            handleSubmit(fields)
        })
    }

    return (
        <Modal
            title="Edit Sprint"
            visible={open}
            onOk={handleFormSubmit}
            onCancel={onClose}
        >
            <Form
                layout="vertical"
                form={form}
                initialValues={{
                    date: [
                        moment(sprint.estimated_start),
                        moment(sprint.estimated_finish),
                    ],
                    name: `${sprint.name}`,
                }}
            >
                <Form.Item
                    rules={[
                        () => ({
                            validator(rule, value: string) {
                                const isConflictingName = otherMilestones?.some(
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
                                value: [moment.Moment, moment.Moment]
                            ) {
                                const startDate = value[0]
                                const endDate = value[1]
                                const isConflictingDate = otherMilestones
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
    )
}

export default EditSprint
