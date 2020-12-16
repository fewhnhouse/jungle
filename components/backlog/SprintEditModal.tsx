import { Form, Input, Modal } from 'antd'
import { Store } from 'antd/lib/form/interface'
import { useRouter } from 'next/router'
import { useQuery, useQueryCache } from 'react-query'
import {
    getMilestones,
    Milestone,
    updateMilestone,
} from '../../taiga-api/milestones'
import dayjs from 'dayjs'
import DatePicker from '../DatePicker'
import isBetween from 'dayjs/plugin/isBetween'
import useMedia from 'use-media'
dayjs.extend(isBetween)

interface Props {
    open: boolean
    sprint: Milestone
    onClose: () => void
}
const EditSprint = ({ open, sprint, onClose }: Props) => {
    const [form] = Form.useForm()
    const { projectId } = useRouter().query
    const queryCache = useQueryCache()
    const isMobile = useMedia('(max-width: 700px)')

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
        const [startDate, endDate]: [dayjs.Dayjs, dayjs.Dayjs] = values.date
        const newMilestone = await updateMilestone(sprint.id, {
            name: values.name,
            estimated_start: startDate.toISOString().split('T')[0],
            estimated_finish: endDate.toISOString().split('T')[0],
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

    const disabledDate = (current) => {
        const today = dayjs()
        const tooEarly = current.isBefore(today)
        const isConflicting = milestones?.find((ms) => {
            if (ms.id === sprint.id) return false
            return current.isBetween(
                ms.estimated_start,
                ms.estimated_finish,
                'day',
                '[]'
            )
        })

        return tooEarly || isConflicting
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
                        dayjs(sprint.estimated_start),
                        dayjs(sprint.estimated_finish),
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
                    <Input size={isMobile ? 'large' : 'middle'} />
                </Form.Item>
                <Form.Item
                    required
                    rules={[
                        () => ({
                            validator(rule, value: [dayjs.Dayjs, dayjs.Dayjs]) {
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
                    <DatePicker.RangePicker
                        size={isMobile ? 'large' : 'middle'}
                        disabledDate={disabledDate}
                        format="YYYY-MM-DD"
                    />
                </Form.Item>
            </Form>
        </Modal>
    )
}

export default EditSprint
