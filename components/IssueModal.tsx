import React from 'react'
import styled from 'styled-components'
import EditableTitle from './EditableTitle'
import EditableDescription from './EditableDescription'
import EditableNumber from './EditableNumber'
import { Modal, Breadcrumb, Button, Dropdown, Loader, Uploader } from 'rsuite'
import { useQuery } from 'react-query'
import { getTask } from '../api/tasks'
import AssigneeDropdown from './AssigneeDropdown'
import StatusDropdown from './StatusDropdown'
import { WrappedLink } from './header/Header'
import { getUserstory } from '../api/userstories'
import { getEpic } from '../api/epics'

const Separator = styled.span`
    font-size: 16px;
`

const Label = styled.span`
    margin-top: ${({ theme }) => theme.spacing.mini};
`

const StyledBreadcrumb = styled(Breadcrumb)`
    margin: 0px;
`

const StyledModalBody = styled(Modal.Body)`
    margin-top: 0px;
`

const StyledModal = styled(Modal)`
    @media only screen and (max-width: 600px) {
        max-width: 90%;
    }
`

const Main = styled.div`
    display: flex;
    flex-direction: row;
    @media only screen and (max-width: 600px) {
        flex-direction: column;
    }
    overflow: auto;
    height: 100%;
`

const Content = styled.div`
    flex: 3;
    display: flex;
    flex-direction: column;
    padding: 10px;
`

const Sidebar = styled.aside`
    flex: 1;
    padding: ${({ theme }) => theme.spacing.small};
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    min-width: 180px;
`

const UploadContent = styled.div`
    width: 100%;
    margin: 10px 0px;
`

interface Props {
    open: boolean
    onClose: () => void
    id: number
    type: 'task' | 'story' | 'epic'
}

export default function IssueModal({ id, type, open, onClose }: Props) {
    const { isLoading, data, isError } = useQuery(
        [type, { id }],
        (type, { id }) => {
            if (type === 'task') {
                return getTask(id)
            } else if (type === 'story') {
                return getUserstory(id)
            } else {
                return getEpic(id)
            }
        },
        { enabled: open }
    )

    if (isLoading) return <Loader />
    if (isError) return <div>Error</div>

    const token = localStorage.getItem('auth-token')

    return (
        <StyledModal show={open} onHide={onClose}>
            <Modal.Header>
                <StyledBreadcrumb separator={<Separator>/</Separator>}>
                    <Breadcrumb.Item>
                        <WrappedLink
                            href="/projects/[projectId]"
                            as={`/projects/${data.project}`}
                        >
                            {data.project_extra_info.name}
                        </WrappedLink>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        <WrappedLink
                            href="/projects/stories/[id]"
                            as={`/projects/stories/${data.user_story}`}
                        >
                            {data.user_story_extra_info.subject}
                        </WrappedLink>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item active>
                        <WrappedLink
                            href="/projects/tasks/[id]"
                            as={`/projects/tasks/${data.id}`}
                        >
                            {data.subject}
                        </WrappedLink>
                    </Breadcrumb.Item>
                </StyledBreadcrumb>
            </Modal.Header>
            <StyledModalBody>
                <Main>
                    <Content>
                        <EditableTitle initialValue={data?.subject} />
                        <EditableDescription initialValue={data?.description} />
                        <Uploader
                            data={{
                                object_id: data.id,
                                project: data.project,
                            }}
                            name="attached_file"
                            headers={{
                                Authorization: token && `Bearer ${token}`,
                            }}
                            action={`${process.env.NEXT_PUBLIC_TAIGA_API_URL}/tasks/attachments`}
                            draggable
                        >
                            <UploadContent>
                                Click or Drag files to this area to upload
                            </UploadContent>
                        </Uploader>
                    </Content>
                    <Sidebar>
                        <Label>Status</Label>
                        <StatusDropdown
                            value={data?.status}
                            onSelect={(value) => {
                                console.log(value)
                            }}
                        />
                        <Label>Assignee</Label>
                        <AssigneeDropdown
                            value={data?.assigned_to}
                            onSelect={(value) => {
                                console.log(value)
                            }}
                        />
                        <Label>Priority</Label>
                        <Dropdown
                            toggleComponentClass={Button}
                            appearance="default"
                            title="Select..."
                        />
                        <Label>Story Points</Label>
                        <EditableNumber initialValue={1} />
                    </Sidebar>
                </Main>
            </StyledModalBody>
        </StyledModal>
    )
}
