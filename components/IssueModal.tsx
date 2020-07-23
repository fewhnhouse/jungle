import React from 'react'

import styled from 'styled-components'
import CloseIcon from '@material-ui/icons/Close'
import EditableTitle from './EditableTitle'
import EditableDescription from './EditableDescription'
import EditableNumber from './EditableNumber'
import CustomSelect from './Select'
import { Modal, Breadcrumb, Button } from 'rsuite'

const Label = styled.span`
    margin-top: ${({ theme }) => theme.spacing.mini};
`

const Header = styled.div`
    width: 100%;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    padding: ${({ theme }) => theme.spacing.small};
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

export default function IssueModal({
    open,
    onClose,
}: {
    open: boolean
    onClose: () => void
}) {
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
                        <EditableTitle initialValue="Test Title" />
                        <EditableDescription initialValue="Test Description" />
                    </Content>
                    <Sidebar>
                        <Label>Status</Label>
                        <CustomSelect />
                        <Label>Assignee</Label>
                        <CustomSelect />
                        <Label>Priority</Label>
                        <CustomSelect />
                        <Label>Story Points</Label>
                        <EditableNumber initialValue={1} />
                    </Sidebar>
                </Main>
            </StyledModalBody>
        </StyledModal>
    )
}
