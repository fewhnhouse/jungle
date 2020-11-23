import React from 'react'
import styled from 'styled-components'
import { useQuery } from 'react-query'
import { Button, Divider, Dropdown, Modal, Skeleton } from 'antd'
import Flex from '../Flex'
import {
    BookOutlined,
    CloseOutlined,
    EllipsisOutlined,
    ProfileOutlined,
} from '@ant-design/icons'
import { ModalProps } from 'antd/lib/modal'
import { useRouter } from 'next/router'
import { getTask, Task } from '../../taiga-api/tasks'
import { getUserstory, UserStory } from '../../taiga-api/userstories'
import TaskBreadcrumbs from './TaskBreadcrumbs'
import UserStoryBreadcrumbs from './UserStoryBreadcrumbs'
import EditableDescription from './EditableDescription'
import EditableTitle from './EditableTitle'
import Comments from '../dnd/comments/Comments'

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
    type: 'userstory' | 'task'
    innerContent?: React.ReactNode
    outerContent?: React.ReactNode
    sidebar?: React.ReactNode
    actions: any
    data: Task | UserStory
}

export default function IssuePage({
    type,
    innerContent,
    outerContent,
    sidebar,
    actions,
    data,
}: Props) {
    const { id } = useRouter().query

    return (
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
            <Divider />
            {outerContent}
            <Divider />
            <Comments
                type={type}
                id={parseInt(id as string, 10)}
                version={data?.version}
            />
        </Flex>
    )
}
