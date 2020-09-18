import { Form, Panel, FormGroup, FormControl, Button, Checkbox } from 'rsuite'
import styled from 'styled-components'
import Flex from '../Flex'

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

const UserDetails = () => {
    return (
        <div>
            <StyledPanel bodyFill bordered header="Username">
                <Form>
                    <StyledFormGroup>
                        <FormControl name="name" />
                    </StyledFormGroup>
                    <Footer>
                        <span>Your username name is visible to everyone.</span>
                        <Button appearance="ghost">Save</Button>
                    </Footer>
                </Form>
            </StyledPanel>
            <StyledPanel bodyFill bordered header="Email">
                <Form>
                    <StyledFormGroup>
                        <span>
                            Please enter your email address used to log in to
                            Taiga.
                        </span>
                        <FormControl name="name" />
                    </StyledFormGroup>
                    <Footer>
                        <span>We will send you a verification email.</span>
                        <Button appearance="ghost">Save</Button>
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
                                <Avatar src="https://cdn.iconscout.com/icon/free/png-256/avatar-370-456322.png" />
                                <UploadButton htmlFor="avatar-upload"></UploadButton>
                                <FileInput
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
                <Form>
                    <StyledFormGroup>
                        <FormControl
                            rows={5}
                            name="textarea"
                            componentClass="textarea"
                        />
                    </StyledFormGroup>
                    <Footer>
                        <span>Your bio lets others know what you can do.</span>
                        <Button appearance="ghost">Save</Button>
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
                        <Checkbox>
                            Confirm that you want to delete your account.
                        </Checkbox>
                        <Button color="red" appearance="ghost">
                            Delete Account
                        </Button>
                    </Footer>
                </Form>
            </StyledPanel>
        </div>
    )
}

export default UserDetails
