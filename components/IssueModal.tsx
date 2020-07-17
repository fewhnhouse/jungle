import React from 'react'

import {
    Breadcrumb,
    BreadcrumbItem,
    Modal,
    Button,
} from 'shards-react'
import styled from 'styled-components'
import CloseIcon from '@material-ui/icons/Close'
import EditableTitle from './EditableTitle'
import EditableDescription from './EditableDescription'
import EditableNumber from './EditableNumber'
import CustomSelect from './Select'

const ModalContainer = styled.div`
    max-height: 90vh;
    display: flex;
    flex-direction: column;
`

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
    ol {
        margin-bottom: 0px;
        padding: ${({ theme }) => theme.spacing.small};
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
        <Modal
            style={{ maxHeight: '90vh' }}
            size="lg"
            open={open}
            toggle={onClose}
        >
            <ModalContainer>
                <Header>
                    <StyledBreadcrumb>
                        <BreadcrumbItem>
                            <a href="#">Home</a>
                        </BreadcrumbItem>
                        <BreadcrumbItem active>Library</BreadcrumbItem>
                    </StyledBreadcrumb>
                    <Button size="sm" theme="light" onClick={onClose}>
                        <CloseIcon />
                    </Button>
                </Header>
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
            </ModalContainer>
        </Modal>
    )
}
