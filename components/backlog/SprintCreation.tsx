import {
    Modal,
    Button,
    Form,
    FormGroup,
    ControlLabel,
    FormControl,
    DateRangePicker,
    ButtonToolbar,
} from 'rsuite'
import { useState } from 'react'
import { useRouter } from 'next/router'
import { queryCache } from 'react-query'
import { createMilestone, Milestone } from '../../taiga-api/milestones'

const SprintCreation = () => {
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
        const newMilestone = await createMilestone({
            name: formState.name,
            estimated_start: formState.dateRange[0].toISOString().split('T')[0],
            estimated_finish: formState.dateRange[1]
                .toISOString()
                .split('T')[0],
            project: projectId,
        })
        queryCache.setQueryData('milestones', (oldMilestones?: Milestone[]) =>
            oldMilestones ? [...oldMilestones, newMilestone] : [newMilestone]
        )
        handleClose()
    }
    return (
        <>
            <Button size="sm" appearance="ghost" onClick={handleOpen}>
                Create Sprint
            </Button>
            <Modal size="xs" show={show} onHide={handleClose}>
                <Modal.Header>
                    <Modal.Title>Create Sprint</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form
                        fluid
                        formValue={formState}
                        onChange={handleChange}
                        onSubmit={handleSubmit}
                    >
                        <FormGroup>
                            <ControlLabel>Name</ControlLabel>
                            <FormControl style={{ width: 300 }} name="name" />
                        </FormGroup>
                        <FormGroup>
                            <ControlLabel>Date</ControlLabel>
                            <FormControl
                                style={{ width: 300 }}
                                accepter={DateRangePicker}
                                name="dateRange"
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

export default SprintCreation
