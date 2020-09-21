import { useRouter } from 'next/router'
import { useState } from 'react'
import { queryCache, useQuery } from 'react-query'
import {
    Form,
    Panel,
    FormGroup,
    FormControl,
    Button,
    Checkbox,
    Placeholder,
    Alert,
} from 'rsuite'
import styled from 'styled-components'
import {
    changeLogo,
    getProject,
    Project,
    updateProject,
} from '../../taiga-api/projects'
import Flex from '../Flex'

const { Paragraph } = Placeholder

const StyledPanel = styled(Panel)`
    margin: 30px 0px;
    &:first-child {
        margin-top: 0px;
    }
    padding: 0px;
    max-width: 500px;
`

const Avatar = styled.img`
    height: 100%;
    width: 100%;
    transition: all 0.3s ease;
    object-fit: contain;
`

const AvatarWrapper = styled.div`
    position: relative;
    height: 100px;
    width: 100px;
    margin: 10px auto;
    border-radius: 50%;
    overflow: hidden;
    box-shadow: 1px 1px 15px -5px black;
    transition: all 0.3s ease;
    cursor: pointer;
    &:hover {
        transform: scale(1.05);
    }

    &:hover ${Avatar} {
        opacity: 0.5;
    }
`

const FileInput = styled.input`
    width: 0;
    height: 0;
`

const UploadButton = styled.label`
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
`

const Footer = styled.div`
    border-top: 1px solid #e5e5ea;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 20px;
    min-height: 60px;
    background: #fafafa;
`

const StyledFormGroup = styled(FormGroup)`
    padding: 10px 20px;
`

const ProjectDetails = () => {
    const { projectId } = useRouter().query

    const { data, error } = useQuery(
        ['project', { projectId }],
        async (key, { projectId }) => {
            return getProject(projectId as string)
        }
    )
    const [name, setName] = useState(data?.name ?? '')
    const [description, setDescription] = useState(data?.description ?? '')
    const [isPrivate, setIsPrivate] = useState(data?.is_private ?? false)
    const [logo, setLogo] = useState(
        data?.logo_big_url ??
            'https://cdn.iconscout.com/icon/free/png-256/avatar-370-456322.png'
    )

    console.log(data)
    if (!data) {
        return <Paragraph rows={5} active />
    }

    const handleNameSubmit = () => {
        queryCache.setQueryData(
            ['project', { projectId }],
            (prevData: Project) => ({ ...prevData, name })
        )
        updateProject(projectId as string, { name }).then(() =>
            Alert.info('Project name successfully updated')
        )
    }

    const handleDescriptionSubmit = () => {
        queryCache.setQueryData(
            ['project', { projectId }],
            (prevData: Project) => ({ ...prevData, description })
        )
        updateProject(projectId as string, { description }).then(() =>
            Alert.info('Project description successfully updated')
        )
    }

    const handleVisibilityToggle = () => {
        console.log(isPrivate)
        queryCache.setQueryData(
            ['project', { projectId }],
            (prevData: Project) => ({
                ...prevData,
                is_private: !prevData.is_private,
            })
        )
        setIsPrivate((isPrivate) => !isPrivate)
        updateProject(projectId as string, {
            is_private: !isPrivate,
        }).then(() => Alert.info('Project visibility successfully updated'))
    }

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files[0]
        const formData = new FormData()
        formData.append('logo', file)
        changeLogo(projectId as string, formData).then(res => console.log(res))
    }

    return (
        <div>
            <StyledPanel bodyFill bordered header="Project Name">
                <Form
                    onChange={(formValue) => setName(formValue.name)}
                    formValue={{ name }}
                    onSubmit={handleNameSubmit}
                >
                    <StyledFormGroup>
                        <FormControl name="name" />
                    </StyledFormGroup>
                    <Footer>
                        <span>Your Project name is visible to everyone.</span>
                        <Button type="submit" appearance="ghost">
                            Save
                        </Button>
                    </Footer>
                </Form>
            </StyledPanel>
            <StyledPanel bodyFill bordered header="Project Description">
                <Form
                    onChange={(formValue) =>
                        setDescription(formValue.description)
                    }
                    formValue={{ description }}
                    onSubmit={handleDescriptionSubmit}
                >
                    <StyledFormGroup>
                        <FormControl
                            rows={5}
                            name="description"
                            componentClass="textarea"
                        />
                    </StyledFormGroup>
                    <Footer>
                        <span>
                            Your Project description makes others understand
                            what this project is about.
                        </span>
                        <Button type="submit" appearance="ghost">
                            Save
                        </Button>
                    </Footer>
                </Form>
            </StyledPanel>
            <StyledPanel bodyFill bordered header="Avatar">
                <Form>
                    <StyledFormGroup>
                        <Flex align="center" justify="space-between">
                            <span>
                                Click the icon to change your Avatar.
                                <br /> It is optional, but strongly recommended.
                            </span>
                            <AvatarWrapper>
                                <Avatar src={logo} />
                                <UploadButton htmlFor="avatar-upload"></UploadButton>
                                <FileInput
                                    onChange={handleAvatarChange}
                                    id="avatar-upload"
                                    className="file-upload"
                                    type="file"
                                    accept="image/*"
                                />
                            </AvatarWrapper>
                        </Flex>
                    </StyledFormGroup>

                    <Footer>
                        <span>
                            Your Avatar helps other people recognize you.
                        </span>
                    </Footer>
                </Form>
            </StyledPanel>
            <StyledPanel bodyFill bordered header="Visibility">
                <Form onSubmit={handleVisibilityToggle}>
                    <StyledFormGroup>
                        <span>
                            {isPrivate
                                ? 'Your project can only be seen by invited members.'
                                : 'Your Project is currently is visible to everyone.'}
                        </span>
                    </StyledFormGroup>
                    <Footer>
                        <span>
                            {isPrivate
                                ? 'Your Project is currently set to private.'
                                : 'Your Project is currently set to public.'}
                        </span>
                        <Button type="submit" appearance="ghost">
                            {isPrivate ? 'Take Public' : 'Take Private'}
                        </Button>
                    </Footer>
                </Form>
            </StyledPanel>
            <StyledPanel bodyFill bordered header="Delete Project">
                <Form>
                    <StyledFormGroup>
                        <span>
                            If you delete your project, you wont be able to
                            restore it later.
                        </span>
                    </StyledFormGroup>
                    <Footer>
                        <Checkbox>
                            Confirm that you want to delete your project.
                        </Checkbox>
                        <Button color="red" appearance="ghost">
                            Delete Project
                        </Button>
                    </Footer>
                </Form>
            </StyledPanel>
        </div>
    )
}

export default ProjectDetails
