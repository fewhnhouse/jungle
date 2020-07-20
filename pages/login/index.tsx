import {
    Card,
    CardHeader,
    FormInput,
    CardBody,
    CardFooter,
    Button,
    FormCheckbox,
} from 'shards-react'
import styled from 'styled-components'
import Link from 'next/link'
import { useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'
import { IUser } from '../../interfaces/User'

const Container = styled.div`
    display: flex;
    background-image: url(jungle.png);
    min-height: 100%;
    width: 100%;
    background-size: cover;
    justify-content: center;
    align-items: center;
`

const StyledCard = styled(Card)`
    margin: 10px;
    width: 300px;
`

const StyledBody = styled(CardBody)`
    padding: 32px 16px;
`

const StyledFooter = styled(CardFooter)`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px;
`

const StyledFormInput = styled(FormInput)`
    margin: 10px 0px;
`

const StyledButton = styled(Button)`
    margin: 0px 5px;
`

export default function Home() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const { push } = useRouter()

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) =>
        setPassword(e.target.value)

    const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) =>
        setUsername(e.target.value)

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        const { data } = await axios.post<unknown, { data: IUser }>('/auth', {
            username,
            password,
            type: 'normal',
        })

        const { id, auth_token, username: name, email } = data
        localStorage.setItem(
            'user',
            JSON.stringify({ id, auth_token, username: name, email })
        )
        push('/')
    }
    return (
        <>
            <Container>
                <form onSubmit={handleLogin}>
                    <StyledCard>
                        <CardHeader>
                            <h3>Into the Jungle</h3>
                        </CardHeader>
                        <StyledBody>
                            <StyledFormInput
                                onChange={handleUsernameChange}
                                value={username}
                                placeholder="username"
                                type="text"
                            />
                            <StyledFormInput
                                onChange={handlePasswordChange}
                                value={password}
                                placeholder="password"
                                type="password"
                            />
                            <p>
                                Forgot your password? Reset it{' '}
                                <Link href="reset-password">
                                    <a>here</a>
                                </Link>
                                .
                            </p>
                        </StyledBody>
                        <StyledFooter>
                            <FormCheckbox>Remember Me</FormCheckbox>
                            <StyledButton type="submit" theme="success">
                                Log In &rarr;
                            </StyledButton>
                        </StyledFooter>
                    </StyledCard>
                </form>
            </Container>
        </>
    )
}
