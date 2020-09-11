import React, { useState } from 'react'
import styled from 'styled-components'
import EditableTitle from './EditableTitle'
import EditableDescription from './EditableDescription'
import EditableNumber from './EditableNumber'
import { Modal, Breadcrumb, Button, Dropdown, Loader } from 'rsuite'
import { useQuery } from 'react-query'
import { getTask } from '../api/tasks'
import AssigneeDropdown from './AssigneeDropdown'
import StatusDropdown from './StatusDropdown'

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

interface Props {
    open: boolean
    onClose: () => void
    id: string
    type: 'task' | 'story' | 'epic'
}

export default function IssueModal({ id, type, open, onClose }: Props) {
    const { data } = useQuery(['task', { id }], (key, { id }) => getTask(id))

    if (!data) {
        return <Loader />
    }

    return (
        <StyledModal show={open} onHide={onClose}>
            <Modal.Header>
                <StyledBreadcrumb size="lg">
                    <Breadcrumb.Item>
                        <a href="#">Home</a>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item active>Library</Breadcrumb.Item>
                </StyledBreadcrumb>
            </Modal.Header>
            <StyledModalBody>
                <Main>
                    <Content>
                        <EditableTitle initialValue={data?.subject} />
                        <EditableDescription initialValue={data?.description} />
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
