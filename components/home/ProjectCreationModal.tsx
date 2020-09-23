import { useState } from 'react'
import { useRouter } from 'next/router'
import {
    Modal,
    Button,
    Form,
    FormGroup,
    ControlLabel,
    FormControl,
    HelpBlock,
    RadioGroup,
    Radio,
} from 'rsuite'
import { addProject, Project } from '../../taiga-api/projects'
import { queryCache } from 'react-query'

interface Props {
    open: boolean
    toggle: () => void
}

export default function ProjectCreationModal({ open, toggle }: Props) {
    const { push } = useRouter()

    const handleClose = () => toggle()

    const [formState, setFormState] = useState({
        name: '',
        description: '',
        visibility: 'private',
    })

    const handleSubmit = async () => {
        const { name, description, visibility } = formState
        const project = await addProject({
            name,
            description,
            is_private: visibility === 'private',
        })
        queryCache.setQueryData('projects', (prevData: Project[]) => [
            ...prevData,
            project,
        ])
        push('/projects/[id]/settings', `/projects/${project.id}/settings`)
    }
    return (
        <Modal centered onHide={handleClose} show={open}>
            <Modal.Header>
                <Modal.Title>New Project</Modal.Title>
            </Modal.Header>
            <Form
                formValue={formState}
                onChange={(formValue: any) => setFormState(formValue)}
                onSubmit={handleSubmit}
            >
                <Modal.Body>
                    <FormGroup>
                        <ControlLabel>Project Name</ControlLabel>
                        <FormControl name="name" />
                        <HelpBlock tooltip>Required</HelpBlock>
                    </FormGroup>
                    <FormGroup>
                        <ControlLabel>Description</ControlLabel>
                        <FormControl
                            name="description"
                            componentClass="textarea"
                        />
                    </FormGroup>
                    <FormControl
                        inline
                        appearance="picker"
                        name="visibility"
                        accepter={RadioGroup}
                    >
                        <Radio value="public">Public</Radio>
                        <Radio value="private">Private</Radio>
                    </FormControl>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={toggle}>Cancel</Button>
                    <Button type="submit" appearance="primary">
                        Create
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    )
}
