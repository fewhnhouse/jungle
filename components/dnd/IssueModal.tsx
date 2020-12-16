import React, { Fragment, useState } from 'react'
import styled from 'styled-components'
import EditableTitle from '../issues/EditableTitle'
import { useQuery } from 'react-query'
import { getTask, Task } from '../../taiga-api/tasks'
import TaskBreadcrumbs from '../issues/TaskBreadcrumbs'
import StoryBreadcrumbs from '../issues/UserStoryBreadcrumbs'
import { Button, Divider, Dropdown, Modal, Skeleton, Tabs } from 'antd'
import Flex from '../Flex'
import { CloseOutlined, EllipsisOutlined } from '@ant-design/icons'
import Comments from './comments/Comments'
import { getUserstory, UserStory } from '../../taiga-api/userstories'
import { ModalProps } from 'antd/lib/modal'
import dynamic from 'next/dynamic'
import useMedia from 'use-media'

const { TabPane } = Tabs

const EditableDescription = dynamic(
    () => import('../issues/EditableDescription'),
    {
        ssr: false,
    }
)

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
    margin-right: 40px;
`

const Sidebar = styled.aside`
    flex: 1;
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
    outerContent?: { label: string; content: React.ReactNode }[]
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
    const [tab, setTab] = useState('general')
    const isMobile = useMedia('(max-width: 700px)')

    const handleTabChange = (tab: string) => setTab(tab)

    if (isError) return <div>Error</div>

    const main = (
        <Main>
            <Content direction="column" justify="flex-start">
                <Flex align="center" style={{ width: '100%' }}>
                    <EditableTitle
                        id={data?.id}
                        version={data?.version}
                        milestone={data?.milestone}
                        type={type}
                        initialValue={data?.subject}
                    />
                </Flex>
                <EditableDescription
                    id={data?.id}
                    version={data?.version}
                    milestone={data?.milestone}
                    type={type}
                    initialValue={data?.description}
                />
                {innerContent}
            </Content>
            <Sidebar>{sidebar}</Sidebar>
        </Main>
    )

    return (
        <StyledModal
            width={1000}
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
                            <Dropdown
                                trigger={['click']}
                                overlay={actions}
                                placement="bottomRight"
                            >
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
                    {isMobile && (
                        <Tabs
                            style={{
                                width: '100%',
                                minHeight: 400,
                            }}
                            defaultActiveKey={tab}
                            onChange={handleTabChange}
                        >
                            <TabPane tab="General" key="general">
                                {main}
                            </TabPane>
                            {outerContent.map((content, index) => (
                                <TabPane
                                    tab={content.label}
                                    key={`outercontent-${index}`}
                                >
                                    {content.content}
                                </TabPane>
                            ))}

                            <TabPane tab="Comments" key="comments">
                                <Comments
                                    type={type}
                                    id={id}
                                    version={data?.version}
                                />
                            </TabPane>
                        </Tabs>
                    )}

                    {!isMobile && (
                        <>
                            {main}
                            {outerContent.map((content, index) => (
                                <Fragment key={index}>
                                    <Divider />
                                    {content.content}
                                </Fragment>
                            ))}
                            <Divider />
                            <Comments
                                type={type}
                                id={id}
                                version={data?.version}
                            />
                        </>
                    )}
                </Flex>
            </Skeleton>
        </StyledModal>
    )
}
