import {
    Modal,
    Button,
    Form,
    FormGroup,
    ControlLabel,
    FormControl,
    ButtonToolbar,
    TagPicker,
    SelectPicker,
    Uploader,
    Input,
    InputPicker,
} from 'rsuite'
import { useState } from 'react'
import { useRouter } from 'next/router'
import { queryCache } from 'react-query'
import { createUserstory, UserStory } from '../../taiga-api/userstories'

const UserstoryCreation = () => {
    const [show, setShow] = useState(false)
    const { projectId } = useRouter().query
    const [formState, setFormState] = useState({
        name: '',
        dateRange: [new Date(), new Date()],
    })

    const handleChange = (value) => {
        setFormState(value)
    }

    const handleOpen = () => setShow(true)
    const handleClose = () => setShow(false)

    const handleSubmit = async (
        checkStatus: boolean,
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault()
        const newUserstory = await createUserstory({
            name: formState.name,
            estimated_start: formState.dateRange[0].toISOString().split('T')[0],
            estimated_finish: formState.dateRange[1]
                .toISOString()
                .split('T')[0],
            project: projectId,
        })
        queryCache.setQueryData('userstories', (oldStories: UserStory[]) => [
            ...oldStories,
            newUserstory,
        ])
        handleClose()
    }
    return (
        <>
            <Button size="sm" appearance="ghost" onClick={handleOpen}>
                Create Story
            </Button>
            <Modal size="sm" show={show} onHide={handleClose}>
                <Modal.Header>
                    <Modal.Title>Create Story</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form
                        fluid
                        formValue={formState}
                        onChange={handleChange}
                        onSubmit={handleSubmit}
                    >
                        <FormGroup>
                            <ControlLabel>Subject</ControlLabel>
                            <FormControl
                                style={{ width: 300 }}
                                name="subject"
                            />
                        </FormGroup>
                        <FormGroup>
                            <ControlLabel>Assignee</ControlLabel>
                            <FormControl
                                data={[]}
                                accepter={SelectPicker}
                                style={{ width: 300 }}
                                name="assignee"
                            />
                        </FormGroup>
                        <FormGroup>
                            <ControlLabel>Tags</ControlLabel>
                            <FormControl
                                data={[]}
                                creatable
                                accepter={TagPicker}
                                style={{ width: 300 }}
                                name="tags"
                            />
                        </FormGroup>
                        <FormGroup>
                            <ControlLabel>Description</ControlLabel>
                            <FormControl
                                accepter={Input}
                                componentClass="textarea"
                                style={{ width: 300 }}
                                name="description"
                            />
                        </FormGroup>
                        <FormGroup>
                            <ControlLabel>Story Points</ControlLabel>
                            <FormControl
                                data={[]}
                                accepter={InputPicker}
                                style={{ width: 300 }}
                                name="description"
                            />
                        </FormGroup>
                        <FormGroup>
                            <ControlLabel>Attachments</ControlLabel>
                            <FormControl
                                accepter={Uploader}
                                style={{ width: 300 }}
                                name="description"
                            />
                        </FormGroup>
                        <FormGroup>
                            <ButtonToolbar>
                                <Button type="submit" appearance="primary">
                                    Create
                                </Button>
                                <Button
                                    onClick={handleClose}
                                    appearance="default"
                                >
                                    Cancel
                                </Button>
                            </ButtonToolbar>
                        </FormGroup>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    )
}

export default UserstoryCreation
