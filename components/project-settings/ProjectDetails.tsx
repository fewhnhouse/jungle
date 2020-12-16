import { Button, Card, Checkbox, Form, Input, message, Skeleton } from 'antd'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useQueryCache, useQuery } from 'react-query'

import styled from 'styled-components'
import useMedia from 'use-media'
import {
    changeLogo,
    deleteProject,
    getProject,
    Project,
    updateProject,
} from '../../taiga-api/projects'
import Flex from '../Flex'

const StyledCard = styled(Card)`
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

const CardContent = styled.div`
    padding: 20px;
`

const StyledFormItem = styled(Form.Item)`
    padding: 20px;
`

const ProjectDetails = () => {
    const { query, replace } = useRouter()
    const { projectId } = query
    const queryCache = useQueryCache()
    const isMobile = useMedia('(max-width: 700px)')

    const { data, isLoading } = useQuery(
        ['project', { projectId }],
        async (key, { projectId }) => {
            return getProject(projectId as string)
        },
        { enabled: projectId }
    )

    useEffect(() => {
        if (data?.logo_small_url) {
            setLogo(data.logo_small_url)
        }
    }, [data])

    const [isPrivate, setIsPrivate] = useState(data?.is_private ?? false)
    const [confirmDeletion, setConfirmDeletion] = useState(false)
    const [logo, setLogo] = useState('/placeholder.webp')

    if (!data) {
        return <Skeleton paragraph={{ rows: 5 }} active />
    }

    const handleNameSubmit = (values: { name: string }) => {
        const { name } = values
        queryCache.setQueryData(
            ['project', { projectId }],
            (prevData: Project) => ({ ...prevData, name })
        )
        updateProject(projectId as string, { name }).then(() =>
            message.success('Project name successfully updated')
        )
    }

    const handleDescriptionSubmit = (values: { description: string }) => {
        const { description } = values

        queryCache.setQueryData(
            ['project', { projectId }],
            (prevData: Project) => ({ ...prevData, description })
        )
        updateProject(projectId as string, { description }).then(() =>
            message.success('Project description successfully updated')
        )
    }

    const handleVisibilityToggle = (values: { visibility: string }) => {
        const { visibility } = values
        queryCache.setQueryData(
            ['project', { projectId }],
            (prevData: Project) => ({
                ...prevData,
                is_private: !prevData.is_private,
            })
        )
        setIsPrivate((isPrivate) => !isPrivate)
        updateProject(projectId as string, {
            is_private: visibility === 'private',
        }).then(() =>
            message.success('Project visibility successfully updated')
        )
    }

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files[0]
        const formData = new FormData()
        formData.append('logo', file)
        changeLogo(projectId as string, formData).then((res) => {
            setLogo(res.logo_small_url)
        })
    }

    const handleDeleteProject = () => {
        deleteProject(projectId as string).then(() => {
            message.success('Project successfully deleted.')
            queryCache.invalidateQueries('projects')
            replace('/projects')
        })
    }

    return (
        <Skeleton loading={isLoading} active>
            <StyledCard bodyStyle={{ padding: 0 }} title="Project Name">
                <Form
                    initialValues={{
                        name: data?.name,
                    }}
                    layout="vertical"
                    onFinish={handleNameSubmit}
                >
                    <StyledFormItem name="name">
                        <Input size={isMobile ? 'large' : 'middle'} />
                    </StyledFormItem>
                    <Footer>
                        <span>Your Project name is visible to everyone.</span>
                        <Button htmlType="submit">Save</Button>
                    </Footer>
                </Form>
            </StyledCard>
            <StyledCard bodyStyle={{ padding: 0 }} title="Project Description">
                <Form
                    initialValues={{
                        description: data?.description,
                    }}
                    layout="vertical"
                    onFinish={handleDescriptionSubmit}
                >
                    <StyledFormItem name="description">
                        <Input.TextArea
                            size={isMobile ? 'large' : 'middle'}
                            rows={5}
                        />
                    </StyledFormItem>
                    <Footer>
                        <span>
                            The Description makes others understand what this
                            project is about.
                        </span>
                        <Button htmlType="submit">Save</Button>
                    </Footer>
                </Form>
            </StyledCard>
            <StyledCard bodyStyle={{ padding: 0 }} title="Project Avatar">
                <Form layout="vertical">
                    <StyledFormItem>
                        <Flex align="center" justify="space-between">
                            <span>
                                Click the icon to change the Avatar.
                                <br /> It is optional, but recommended.
                            </span>
                            <AvatarWrapper>
                                <Avatar alt="Avatar" src={logo} />
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
                    </StyledFormItem>

                    <Footer>
                        <span>
                            The Avatar helps other people recognize this
                            project.
                        </span>
                    </Footer>
                </Form>
            </StyledCard>
            <StyledCard bodyStyle={{ padding: 0 }} title="Visibility">
                <Form layout="vertical" onFinish={handleVisibilityToggle}>
                    <CardContent>
                        <span>
                            {isPrivate
                                ? 'Your project can only be seen by invited members.'
                                : 'Your Project is currently is visible to everyone.'}
                        </span>
                    </CardContent>
                    <Footer>
                        <span>
                            {isPrivate
                                ? 'Your Project is currently set to private.'
                                : 'Your Project is currently set to public.'}
                        </span>
                        <Button htmlType="submit">
                            {isPrivate ? 'Take Public' : 'Take Private'}
                        </Button>
                    </Footer>
                </Form>
            </StyledCard>
            <StyledCard bodyStyle={{ padding: 0 }} title="Delete Project">
                <Form layout="vertical">
                    <CardContent>
                        <span>
                            If you delete your project, you wont be able to
                            restore it later.
                        </span>
                    </CardContent>
                    <Footer>
                        <Checkbox
                            checked={confirmDeletion}
                            onChange={(e) =>
                                setConfirmDeletion(e.target.checked)
                            }
                        >
                            Confirm that you want to delete your project.
                        </Checkbox>
                        <Button
                            disabled={!confirmDeletion}
                            onClick={handleDeleteProject}
                            danger
                        >
                            Delete Project
                        </Button>
                    </Footer>
                </Form>
            </StyledCard>
        </Skeleton>
    )
}

export default ProjectDetails
