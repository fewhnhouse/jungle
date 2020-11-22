import React from 'react'
import styled from 'styled-components'
import EditableTitle from '../EditableTitle'
import EditableDescription from '../EditableDescription'
import { useQuery } from 'react-query'
import { getTask, Task } from '../../taiga-api/tasks'
import TaskBreadcrumbs from '../TaskBreadcrumbs'
import StoryBreadcrumbs from '../UserStoryBreadcrumbs'
import { Button, Divider, Dropdown, Modal, Skeleton } from 'antd'
import Flex from '../Flex'
import {
    BookOutlined,
    CloseOutlined,
    EllipsisOutlined,
    ProfileOutlined,
} from '@ant-design/icons'
import Comments from './comments/Comments'
import { getUserstory, UserStory } from '../../taiga-api/userstories'
import { ModalProps } from 'antd/lib/modal'

const StyledTaskIcon = styled(ProfileOutlined)`
    display: block;
    background: #45aaff;
    border-radius: 3px;
    font-size: 20px;
    padding: 5px;
    color: #2c3e50;
    margin-right: 5px;
`

const StyledUserStoryIcon = styled(BookOutlined)`
    background: #2ecc71;
    font-size: 20px;
    border-radius: 3px;
    padding: 5px;
    margin-right: 5px;
    color: #2c3e50;
`

const StyledModal = styled(Modal)`
    .ant-modal-close {
        visibility: hidden;
    }
`

const HeaderActionContainer = styled(Flex)`
    & > :first-child {
        margin-right: 5px;
    }
`

const Main = styled.div`
    display: flex;
    width: 100%;
    flex-direction: row;
    @media only screen and (max-width: 600px) {
        flex-direction: column;
    }
    overflow: auto;
    height: 100%;
`

const Content = styled(Flex)`
    flex: 3;
    margin-right: 10px;
`

const Sidebar = styled.aside`
    flex: 1;
    padding: ${({ theme }) => theme.spacing.small};
    display: flex;
    flex-direction: column;
    align-items: flex-start;
`

interface Props extends ModalProps {
    open: boolean
    onClose: () => void
    id: number
    type: 'userstory' | 'task'
    innerContent?: React.ReactNode
    outerContent?: React.ReactNode
    sidebar?: React.ReactNode
    actions: any
}

export default function IssueModal({
    id,
    type,
    innerContent,
    outerContent,
    sidebar,
    actions,
    open,
    onClose,
}: Props) {
    const { isLoading, data, isError } = useQuery<Task | UserStory>(
        [type, { id }],
        (key, { id }) => (type === 'task' ? getTask(id) : getUserstory(id)),
        { enabled: open }
    )

    if (isError) return <div>Error</div>

    return (
        <StyledModal
            title={
                <Flex
                    justify="space-between"
                    align="center"
                    style={{ marginRight: 20 }}
                    fluid
                >
                    <Skeleton active loading={isLoading}>
                        {type === 'task' ? (
                            <TaskBreadcrumbs data={data as Task} />
                        ) : (
                            <StoryBreadcrumbs data={data as UserStory} />
                        )}
                        <HeaderActionContainer>
                            <Dropdown overlay={actions} placement="bottomRight">
                                <Button icon={<EllipsisOutlined />} />
                            </Dropdown>
                            <Button
                                onClick={onClose}
                                icon={<CloseOutlined />}
                            />
                        </HeaderActionContainer>
                    </Skeleton>
                </Flex>
            }
            footer={null}
            visible={open}
            onCancel={onClose}
            onOk={onClose}
        >
            <Skeleton active paragraph={{ rows: 5 }} loading={isLoading}>
                <Flex direction="column">
                    <Main>
                        <Content direction="column" justify="space-between">
                            <Flex align="center">
                                <div>
                                    {type === 'task' ? (
                                        <StyledTaskIcon />
                                    ) : (
                                        <StyledUserStoryIcon />
                                    )}
                                </div>
                                <EditableTitle
                                    onSubmit={() => console.log('submit')}
                                    initialValue={data?.subject}
                                />
                            </Flex>
                            <EditableDescription
                                initialValue={data?.description}
                            />
                            {innerContent}
                        </Content>
                        <Sidebar>{sidebar}</Sidebar>
                    </Main>
                    <Divider />
                    {outerContent}
                    <Comments type={type} id={id} version={data?.version} />
                </Flex>
            </Skeleton>
        </StyledModal>
    )
}
