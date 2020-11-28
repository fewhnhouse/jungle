import { useState } from 'react'
import { useRouter } from 'next/router'
import { queryCache, useQuery } from 'react-query'
import { Button, Divider, Form, Modal, Select, Typography } from 'antd'
import Image from 'next/image'
import Flex from '../Flex'
import styled from 'styled-components'
import { getTasks, Task, updateTask } from '../../taiga-api/tasks'
import {
    getUserstories,
    updateUserstory,
    UserStory,
} from '../../taiga-api/userstories'
import {
    getMilestones,
    Milestone,
    updateMilestone,
} from '../../taiga-api/milestones'

const ImgContainer = styled.div`
    margin-right: 10px;
`

const StyledSelect = styled(Select)`
    min-width: 200px;
`

interface Props {
    milestoneId?: number
}
const SprintCompletionModal = ({ milestoneId }: Props) => {
    const [show, setShow] = useState(false)
    const [loading, setLoading] = useState(false)
    const [form] = Form.useForm()
    const { projectId } = useRouter().query

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

    const { data: tasks } = useQuery(
        ['tasks', { projectId, milestoneId }],
        (key, { projectId, milestoneId }) =>
            getTasks({
                projectId,
                milestone: milestoneId.toString(),
            }),
        { enabled: milestoneId && projectId }
    )

    const { data: stories } = useQuery(
        ['userstories', { projectId, milestoneId }],
        (key, { projectId, milestoneId }) =>
            getUserstories({ projectId, milestone: milestoneId.toString() }),
        { enabled: milestoneId && projectId }
    )

    const openTasks = tasks?.filter(
        (task) => !task.is_closed && task.user_story === null
    )
    const openStories = stories?.filter((story) => !story.is_closed)

    const handleOpen = () => setShow(true)
    const handleClose = () => setShow(false)

    const handleComplete = async (moveId: number | null) => {
        setLoading(true)
        const updatedTasks = await Promise.all(
            openTasks?.map((task) =>
                updateTask(task.id, {
                    milestone: moveId,
                    version: task.version,
                })
            ) ?? []
        )
        const updatedStories = await Promise.all(
            openStories?.map((story) =>
                updateUserstory(story.id, {
                    milestone: moveId,
                    version: story.version,
                })
            ) ?? []
        )
        await updateMilestone(milestoneId, {
            closed: true,
        })
        setLoading(false)
        queryCache.setQueryData(
            ['userstories', { projectId }],
            (prevData: UserStory[]) =>
                prevData.map(
                    (us) =>
                        updatedStories.find(
                            (updatedUs) => updatedUs.id === us.id
                        ) ?? us
                )
        )
        queryCache.setQueryData(['tasks', { projectId }], (prevData: Task[]) =>
            prevData?.map(
                (task) =>
                    updatedTasks.find((updated) => updated.id === task.id) ??
                    task
            )
        )

        handleClose()
    }

    const handleOkay = () => {
        form.validateFields().then((fields) => {
            form.resetFields()
            handleComplete(fields.moveTo === 'backlog' ? null : fields.moveTo)
        })
    }

    return (
        <>
            <Button type="primary" onClick={handleOpen}>
                Complete
            </Button>
            <Modal
                confirmLoading={loading}
                title="Complete Sprint"
                visible={show}
                onOk={handleOkay}
                onCancel={handleClose}
            >
                <Flex>
                    <ImgContainer>
                        <Image
                            src="/task_done.png"
                            width="100px"
                            height="100px"
                        />
                    </ImgContainer>
                    <Flex direction="column">
                        <Typography.Title level={3}>
                            Complete Sprint
                        </Typography.Title>
                        {openTasks?.length + openStories?.length > 0 ? (
                            <>
                                <Typography.Text>
                                    {`There is still a total of ${
                                        openTasks?.length + openStories?.length
                                    } open Tasks / Stories remaining in the Sprint.`}
                                </Typography.Text>
                                <Typography.Text>
                                    Please select where open tasks should be
                                    moved to.
                                </Typography.Text>
                                <Divider />
                                <Form
                                    initialValues={{ moveTo: 'backlog' }}
                                    form={form}
                                >
                                    <Form.Item name="moveTo" required>
                                        <StyledSelect>
                                            {milestones
                                                ?.filter(
                                                    (ms) =>
                                                        ms.id !== milestoneId &&
                                                        !ms.closed
                                                )
                                                .map((ms) => (
                                                    <Select.Option
                                                        value={ms.id}
                                                        key={ms.id}
                                                    >
                                                        <Flex direction="column">
                                                            <span>
                                                                {ms.name}
                                                            </span>
                                                            <Typography.Text
                                                                style={{
                                                                    color:
                                                                        '#ccc',
                                                                }}
                                                            >
                                                                {new Date(
                                                                    ms.estimated_start
                                                                ).toLocaleDateString() +
                                                                    ' - ' +
                                                                    new Date(
                                                                        ms.estimated_finish
                                                                    ).toLocaleDateString()}
                                                            </Typography.Text>
                                                        </Flex>
                                                    </Select.Option>
                                                ))}
                                            <Select.Option
                                                value="backlog"
                                                key="backlog"
                                            >
                                                Backlog
                                            </Select.Option>
                                        </StyledSelect>
                                    </Form.Item>
                                </Form>
                            </>
                        ) : (
                            <Typography.Text>
                                All Tasks and User Stories from this Sprint have
                                been completed.
                            </Typography.Text>
                        )}
                    </Flex>
                </Flex>
            </Modal>
        </>
    )
}

export default SprintCompletionModal
