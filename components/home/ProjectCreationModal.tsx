import { useState } from 'react'
import authInstance from '../../util/axiosInstance'
import { useRouter } from 'next/router'
import { IProject } from '../../interfaces/Project'
import { Modal, Button, Input } from 'rsuite'

interface Props {
    open: boolean
    toggle: () => void
}

export default function ProjectCreationModal({ open, toggle }: Props) {
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const { push } = useRouter()

    const handleClose = () => toggle()

    const handleDescriptionChange = (value: string) => setDescription(value)
    const handleNameChange = (value: string) => setName(value)

    const createProject = async () => {
        const token = localStorage.getItem('auth-token')
        const { data } = await authInstance.post<IProject>(
            '/projects',
            { name, description },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        )
        const { id } = data
        push('/projects/[id]/settings', `/projects/${id}/settings`)
    }
    return (
        <Modal centered onHide={handleClose} show={open}>
            <Modal.Header>
                <Modal.Title>New Project</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Input
                    value={name}
                    onChange={handleNameChange}
                    placeholder="Project Name"
                    className="mb-2"
                ></Input>
                <Input
                    type="textarea"
                    value={description}
                    onChange={handleDescriptionChange}
                    rows="4"
                    className="mb-2"
                    placeholder="Description"
                ></Input>
            </Modal.Body>
            <Modal.Footer>
                <Button theme="light" onClick={toggle}>
                    Cancel
                </Button>
                <Button theme="success" onClick={createProject}>
                    Create
                </Button>
            </Modal.Footer>
        </Modal>
    )
}
