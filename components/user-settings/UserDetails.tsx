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
import { changeAvatar, getMe, updateUser, User } from '../../taiga-api/users'
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

const StyledFormGroup = styled(FormGroup)`
    padding: 10px 20px;
`

const UserDetails = () => {
    const { data, error } = useQuery('me', () => getMe())
    const [email, setEmail] = useState(data?.email ?? '')
    const [username, setUsername] = useState(data?.username ?? '')
    const [fullName, setFullName] = useState(data?.full_name ?? '')
    const [bio, setBio] = useState(data?.bio ?? '')
    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmDeletion, setConfirmDeletion] = useState(false)
    const [logo, setLogo] = useState(
        data?.photo ??
            'https://cdn.iconscout.com/icon/free/png-256/avatar-370-456322.png'
    )

    if (!data) {
        return <Paragraph rows={5} active />
    }

    const handleFieldSubmit = (
        field: string,
        value: unknown,
        fieldName: string
    ) => () => {
        queryCache.setQueryData('me', (prevData: User) => ({
            ...prevData,
            [field]: value,
        }))
        updateUser(data?.id, { [field]: value }).then(() =>
            Alert.info(`${fieldName} successfully updated`)
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

    const handleDeleteUser = () => {
        console.log('delete')
    }

    return (
        <div>
            <StyledPanel bodyFill bordered header="Username">
                <Form
                    formValue={{ username }}
                    onSubmit={handleFieldSubmit(
                        'username',
                        username,
                        'Username'
                    )}
                    onChange={(formValue) => setUsername(formValue.username)}
                >
                    <StyledFormGroup>
                        <FormControl name="username" />
                    </StyledFormGroup>
                    <Footer>
                        <span>Your username name is visible to everyone.</span>
                        <Button type="submit" appearance="ghost">
                            Save
                        </Button>
                    </Footer>
                </Form>
            </StyledPanel>
            <StyledPanel bodyFill bordered header="Full Name">
                <Form
                    formValue={{ fullName }}
                    onSubmit={handleFieldSubmit(
                        'full_name',
                        fullName,
                        'Full Name'
                    )}
                    onChange={(formValue) => setFullName(formValue.fullName)}
                >
                    <StyledFormGroup>
                        <FormControl name="fullName" />
                    </StyledFormGroup>
                    <Footer>
                        <span>
                            Your full name is important for others to recognize
                            you.
                        </span>
                        <Button type="submit" appearance="ghost">
                            Save
                        </Button>
                    </Footer>
                </Form>
            </StyledPanel>
            <StyledPanel bodyFill bordered header="Email">
                <Form
                    formValue={{ email }}
                    onSubmit={handleFieldSubmit('email', email, 'Email')}
                    onChange={(formValue) => setEmail(formValue.email)}
                >
                    <StyledFormGroup>
                        <Description>
                            Please enter your email address used to log in to
                            Taiga.
                        </Description>
                        <FormControl type="email" name="email" />
                    </StyledFormGroup>
                    <Footer>
                        <span>We will send you a verification email.</span>
                        <Button type="submit" appearance="ghost">
                            Save
                        </Button>
                    </Footer>
                </Form>
            </StyledPanel>
            <StyledPanel bodyFill bordered header="Password">
                <Form>
                    <StyledFormGroup>
                        <Description>
                            Please enter your current password and a new one in
                            order to update it.
                        </Description>
                        <FormControl
                            style={{ marginBottom: 10 }}
                            name="currentPassword"
                        />
                        <FormControl name="newPassword" />
                    </StyledFormGroup>
                    <Footer>
                        <span>We will send you a verification email.</span>
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
                    </StyledFormGroup>

                    <Footer>
                        <span>
                            Your Avatar helps other people recognize you.
                        </span>
                    </Footer>
                </Form>
            </StyledPanel>
            <StyledPanel bodyFill bordered header="Bio">
                <Form
                    formValue={{ bio }}
                    onSubmit={handleFieldSubmit('bio', bio, 'Bio')}
                    onChange={(formValue) => setBio(formValue.bio)}
                >
                    <StyledFormGroup>
                        <FormControl
                            rows={5}
                            name="bio"
                            componentClass="textarea"
                        />
                    </StyledFormGroup>
                    <Footer>
                        <span>Your bio lets others know what you can do.</span>
                        <Button type="submit" appearance="ghost">
                            Save
                        </Button>
                    </Footer>
                </Form>
            </StyledPanel>

            <StyledPanel bodyFill bordered header="Delete Account">
                <Form>
                    <StyledFormGroup>
                        <span>
                            If you delete your account, you wont be able to
                            restore it later.
                        </span>
                    </StyledFormGroup>
                    <Footer>
                        <Checkbox
                            value={confirmDeletion}
                            onChange={(e, checked) =>
                                setConfirmDeletion(checked)
                            }
                        >
                            Confirm that you want to delete your account.
                        </Checkbox>
                        <Button
                            disabled={!confirmDeletion}
                            onClick={handleDeleteUser}
                            color="red"
                            appearance="ghost"
                        >
                            Delete Account
                        </Button>
                    </Footer>
                </Form>
            </StyledPanel>
        </div>
    )
}

export default UserDetails
