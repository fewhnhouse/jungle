import styled from 'styled-components'
import Link from 'next/link'
import { useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'
import { IUser } from '../../interfaces/User'
import {
    Panel,
    Button,
    Checkbox,
    Form,
    FormGroup,
    ButtonToolbar,
    ControlLabel,
    FormControl,
    Alert,
    CheckboxGroup,
} from 'rsuite'

const Container = styled.div`
    display: flex;
    background-image: url(jungle.png);
    min-height: 100%;
    width: 100%;
    background-size: cover;
    justify-content: center;
    align-items: center;
`

const StyledPanel = styled(Panel)`
    background: white;
    box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.15);
`

export default function Home() {
    const [formState, setFormState] = useState({
        username: '',
        password: '',
        remember: false,
    })

    const { push } = useRouter()

    const handleLogin = async () => {
        const { username, password, remember } = formState
        try {
            const { data } = await axios.post<unknown, { data: IUser }>(
                '/auth',
                {
                    username,
                    password,
                    type: 'normal',
                }
            )

            const { id, auth_token, username: name, email } = data
            localStorage.setItem(
                'user',
                JSON.stringify({ id, username: name, email })
            )
            localStorage.setItem('auth-token', auth_token)
            push('/')
        } catch (e) {
            Alert.error('Login failed.')
        }
    }
    return (
        <>
            <Container>
                <StyledPanel bordered title={<h3>Into the Jungle</h3>}>
                    <Form
                        onSubmit={handleLogin}
                        value={formState}
                        onChange={(value: {
                            username: string
                            password: string
                            remember: boolean
                        }) => setFormState(value)}
                    >
                        <FormGroup>
                            <ControlLabel>Username</ControlLabel>
                            <FormControl name="username" />
                        </FormGroup>
                        <FormGroup>
                            <ControlLabel>Password</ControlLabel>
                            <FormControl name="password" type="password" />
                        </FormGroup>
                        <p>
                            Forgot your password? Reset it{' '}
                            <Link href="reset-password">
                                <a>here</a>
                            </Link>
                            .
                        </p>
                        <FormGroup>
                            <FormControl
                                accepter={CheckboxGroup}
                                name="remember"
                                inline
                            >
                                <Checkbox>Remember me</Checkbox>
                            </FormControl>
                        </FormGroup>
                        <FormGroup>
                            <ButtonToolbar>
                                <Button type="submit" appearance="primary">
                                    Log In &rarr;
                                </Button>
                            </ButtonToolbar>
                        </FormGroup>
                    </Form>
                </StyledPanel>
            </Container>
        </>
    )
}
