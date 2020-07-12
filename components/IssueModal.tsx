import React from 'react'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'

import {
    Breadcrumb,
    BreadcrumbItem,
    Modal,
    ModalHeader,
    ModalBody,
    Button,
    FormInput,
} from 'shards-react'

import { useSpring, animated } from 'react-spring'
import styled from 'styled-components'
import CloseIcon from '@material-ui/icons/Close'
import EditableTitle from './EditableTitle'
import EditableDescription from './EditableDescription'
import CustomSelect from './Select'

const ModalContainer = styled.div`
    background: #ecf0f1;
    border-radius: 4px;
    width: 80vw;
    height: 80vh;
    padding: 20px;
`

const Header = styled.div`
    width: 100%;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    padding: 10px;
`

const StyledBreadcrumb = styled(Breadcrumb)`
    ol {
        margin-bottom: 0px;
        padding: 10px;
    }
`

const Main = styled.main`
    display: flex;
    flex-direction: row;
`

const Content = styled.div`
    flex: 3;
    display: flex;
    flex-direction: column;
    padding: 10px;
`

const Sidebar = styled.aside`
    flex: 1;
`

const Footer = styled.footer`
    display: flex;
`

export default function IssueModal({
    open,
    onClose,
}: {
    open: boolean
    onClose: () => void
}) {
    return (
        <Modal size="lg" open={open} toggle={onClose}>
            <Header>
                <StyledBreadcrumb>
                    <BreadcrumbItem>
                        <a href="#">Home</a>
                    </BreadcrumbItem>
                    <BreadcrumbItem active>Library</BreadcrumbItem>
                </StyledBreadcrumb>
                <CustomSelect />
                <Button size="sm" theme="light" onClick={onClose}>
                    <CloseIcon />
                </Button>
            </Header>
            <Content>
                <EditableTitle initialValue="Test Title" />
                <EditableDescription initialValue="Test Description" />
            </Content>
            <Sidebar></Sidebar>
        </Modal>
    )
}
