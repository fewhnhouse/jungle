import React from 'react'
import styled from 'styled-components'
import EditableTitle from '../EditableTitle'
import EditableDescription from '../EditableDescription'
import EditableNumber from '../EditableNumber'
import { Modal, Button, Dropdown, Placeholder, Uploader, Divider } from 'rsuite'
import { useQuery } from 'react-query'
import AssigneeDropdown from '../AssigneeDropdown'
import StatusDropdown from '../StatusDropdown'
import { getUserstory } from '../../api/userstories'
import Breadcrumbs from './Breadcrumbs'
import SubtaskList from './SubtaskList'

const { Paragraph } = Placeholder

const Label = styled.span`
    margin-top: ${({ theme }) => theme.spacing.mini};
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
}

export default function IssueModal({ id, open, onClose }: Props) {
    const { isLoading, data, isError } = useQuery(
        ['story', { id }],
        (key, { id }) => getUserstory(id),
        { enabled: open }
    )

    if (isError) return <div>Error</div>

    const token = localStorage.getItem('auth-token')

    return data ? (
        <StyledModal show={open} onHide={onClose}>
            {isLoading ? (
                <Paragraph active rows={10} />
            ) : (
                <>
                    <Modal.Header>
                        <Breadcrumbs data={data} />
                    </Modal.Header>
                    <StyledModalBody>
                        <Main>
                            <Content>
                                <EditableTitle initialValue={data?.subject} />
                                <EditableDescription
                                    initialValue={data?.description}
                                />
                                <Uploader
                                    data={{
                                        object_id: data.id,
                                        project: data.project,
                                    }}
                                    name="attached_file"
                                    headers={{
                                        Authorization:
                                            token && `Bearer ${token}`,
                                    }}
                                    action={`${process.env.NEXT_PUBLIC_TAIGA_API_URL}/tasks/attachments`}
                                    draggable
                                >
                                    <UploadContent>
                                        Click or Drag files to this area to
                                        upload
                                    </UploadContent>
                                </Uploader>
                                <Divider />
                                <SubtaskList id={id} />
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
                </>
            )}
        </StyledModal>
    ) : null
}
