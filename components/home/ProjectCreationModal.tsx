import {
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    Progress,
    FormInput,
    FormTextarea,
    ModalFooter,
} from 'shards-react'
import { useState } from 'react'
import Axios from 'axios'
import authInstance from '../../util/axiosInstance'
import { useRouter } from 'next/router'
import { IProject } from '../../interfaces/Project'

interface Props {
    open: boolean
    toggle: () => void
}

export default function ProjectCreationModal({ open, toggle }: Props) {
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const { push } = useRouter()

    const handleDescriptionChange = (
        e: React.ChangeEvent<HTMLTextAreaElement>
    ) => setDescription(e.target.value)
    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) =>
        setName(e.target.value)

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
        <Modal centered toggle={toggle} open={open}>
            <ModalHeader>New Project</ModalHeader>
            <ModalBody>
                <FormInput
                    value={name}
                    onChange={handleNameChange}
                    placeholder="Project Name"
                    className="mb-2"
                ></FormInput>
                <FormTextarea
                    value={description}
                    onChange={handleDescriptionChange}
                    rows="4"
                    className="mb-2"
                    placeholder="Description"
                ></FormTextarea>
            </ModalBody>
            <ModalFooter>
                <Button theme="light" onClick={toggle}>
                    Cancel
                </Button>
                <Button theme="success" onClick={createProject}>
                    Create
                </Button>
            </ModalFooter>
        </Modal>
    )
}
