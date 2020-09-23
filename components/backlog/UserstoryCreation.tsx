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
import { queryCache, useQuery } from 'react-query'
import { createUserstory, UserStory } from '../../taiga-api/userstories'
import { getProject } from '../../taiga-api/projects'

const UserstoryCreation = () => {
    const [show, setShow] = useState(false)
    const { projectId } = useRouter().query

    const { data } = useQuery(
        ['project', { projectId }],
        (key, { projectId }) => getProject(projectId as string),
        { enabled: projectId }
    )

    const [formState, setFormState] = useState({
        subject: '',
        description: '',
        tags: [],
        assignee: null,
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
        const { subject, assignee, description, tags } = formState
        const newUserstory = await createUserstory({
            subject,
            assigned_to: assignee,
            description,
            tags,
            project: projectId,
        })
        queryCache.setQueryData('backlog', (prevData?: UserStory[]) =>
            prevData ? [...prevData, newUserstory] : [newUserstory]
        )
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
                <Form
                    fluid
                    formValue={formState}
                    onChange={handleChange}
                    onSubmit={handleSubmit}
                >
                    <Modal.Body>
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
                                data={
                                    data?.members.map((member) => ({
                                        value: member.id,
                                        label: member.full_name,
                                    })) ?? []
                                }
                                accepter={SelectPicker}
                                style={{ width: 300 }}
                                name="assignee"
                            />
                        </FormGroup>
                        <FormGroup>
                            <ControlLabel>Tags</ControlLabel>
                            <FormControl
                                data={
                                    data?.tags.map((tag) => ({
                                        value: tag,
                                        label: tag,
                                    })) ?? []
                                }
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
                    </Modal.Body>
                    <Modal.Footer>
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
                    </Modal.Footer>
                </Form>
            </Modal>
        </>
    )
}

export default UserstoryCreation
