import { useEffect, useState } from 'react'
import { useQueryCache, useQuery } from 'react-query'
import { Button, Card, Checkbox, Form, Input, message, Skeleton } from 'antd'
import styled from 'styled-components'
import {
    changeAvatar,
    changePassword,
    getMe,
    updateUser,
    User,
} from '../../taiga-api/users'
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
    display: none;
`

const Description = styled.p`
    margin-bottom: 10px;
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
    padding: 10px 20px;
`

const StyledFormItem = styled(Form.Item)`
    padding: 20px;
`

const UserDetails = () => {
    const { data } = useQuery('me', () => getMe())
    const queryCache = useQueryCache()

    useEffect(() => {
        if (data?.photo) {
            setLogo(data.photo)
        }
    }, [data])
    const [confirmDeletion, setConfirmDeletion] = useState(false)
    const [logo, setLogo] = useState('/placeholder.webp')

    if (!data) {
        return <Skeleton paragraph={{ rows: 5 }} active />
    }

    const handleFieldSubmit = (field: string, fieldName: string) => (values: {
        [key: string]: unknown
    }) => {
        queryCache.setQueryData('me', (prevData: User) => ({
            ...prevData,
            [field]: values[field],
        }))
        updateUser(data?.id, { [field]: values[field] }).then(() =>
            message.success(`${fieldName} successfully updated`)
        )
    }

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files[0]
        const formData = new FormData()
        formData.append('avatar', file)
        changeAvatar(formData).then((res) => {
            setLogo(res.photo)
        })
    }

    const handlePasswordChange = (
        currentPassword: string,
        newPassword: string
    ) => {
        changePassword(currentPassword, newPassword).then(() => {
            message.success(`Password successfully updated`)
        })
    }

    const handleDeleteUser = () => {
        console.log('delete')
    }

    return (
        <div>
            <StyledCard bodyStyle={{ padding: 0 }} title="Username">
                <Form onFinish={handleFieldSubmit('username', 'Username')}>
                    <StyledFormItem name="username">
                        <Input defaultValue={data.username} />
                    </StyledFormItem>
                    <Footer>
                        <span>Your username name is visible to everyone.</span>
                        <Button htmlType="submit">Save</Button>
                    </Footer>
                </Form>
            </StyledCard>
            <StyledCard bodyStyle={{ padding: 0 }} title="Full Name">
                <Form onFinish={handleFieldSubmit('full_name', 'Full Name')}>
                    <StyledFormItem name="fullName">
                        <Input defaultValue={data.full_name} />
                    </StyledFormItem>

                    <Footer>
                        <span>
                            Your full name is important for others to recognize
                            you.
                        </span>
                        <Button htmlType="submit">Save</Button>
                    </Footer>
                </Form>
            </StyledCard>
            <StyledCard bodyStyle={{ padding: 0 }} title="Email">
                <Form onFinish={handleFieldSubmit('email', 'Email')}>
                    <CardContent>
                        <Description>
                            Please enter your email address used to log in to
                            Taiga.
                        </Description>
                        <Form.Item name="email">
                            <Input defaultValue={data.email} type="email" />
                        </Form.Item>
                    </CardContent>
                    <Footer>
                        <span>We will send you a verification email.</span>
                        <Button htmlType="submit">Save</Button>
                    </Footer>
                </Form>
            </StyledCard>
            <StyledCard bodyStyle={{ padding: 0 }} title="Password">
                <Form
                    onFinish={(values: {
                        currentPassword: string
                        newPassword: string
                    }) =>
                        handlePasswordChange(
                            values.currentPassword,
                            values.newPassword
                        )
                    }
                >
                    <CardContent>
                        <Description>
                            Please enter your current password and a new one in
                            order to update it.
                        </Description>
                        <Form.Item
                            style={{ marginBottom: 10 }}
                            name="currentPassword"
                        >
                            <Input.Password />
                        </Form.Item>
                        <Form.Item name="newPassword">
                            <Input.Password />
                        </Form.Item>
                    </CardContent>
                    <Footer>
                        <span>We will send you a verification email.</span>
                        <Button htmlType="submit">Save</Button>
                    </Footer>
                </Form>
            </StyledCard>

            <StyledCard bodyStyle={{ padding: 0 }} title="Avatar">
                <Form>
                    <CardContent>
                        <Flex align="center" justify="space-between">
                            <Description>
                                Click the icon to change your Avatar.
                                <br /> It is optional, but strongly recommended.
                            </Description>
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
                    </CardContent>

                    <Footer>
                        <span>
                            Your Avatar helps other people recognize you.
                        </span>
                    </Footer>
                </Form>
            </StyledCard>
            <StyledCard bodyStyle={{ padding: 0 }} title="Bio">
                <Form onFinish={handleFieldSubmit('bio', 'Bio')}>
                    <StyledFormItem name="bio">
                        <Input.TextArea defaultValue={data.bio} rows={5} />
                    </StyledFormItem>
                    <Footer>
                        <span>Your bio lets others know what you can do.</span>
                        <Button htmlType="submit">Save</Button>
                    </Footer>
                </Form>
            </StyledCard>

            <StyledCard bodyStyle={{ padding: 0 }} title="Delete Account">
                <Form>
                    <CardContent>
                        <span>
                            If you delete your account, you wont be able to
                            restore it later.
                        </span>
                    </CardContent>
                    <Footer>
                        <Checkbox
                            value={confirmDeletion}
                            onChange={(e) =>
                                setConfirmDeletion(e.target.checked)
                            }
                        >
                            Confirm that you want to delete your account.
                        </Checkbox>
                        <Button
                            disabled={!confirmDeletion}
                            onClick={handleDeleteUser}
                            danger
                        >
                            Delete Account
                        </Button>
                    </Footer>
                </Form>
            </StyledCard>
        </div>
    )
}

export default UserDetails
