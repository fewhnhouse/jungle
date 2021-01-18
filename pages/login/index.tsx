import styled from 'styled-components'
import Link from 'next/link'
import axios from 'axios'
import { useRouter } from 'next/router'

import { User } from '../../taiga-api/users'
import { Button, Card, Checkbox, Form, Input, message } from 'antd'
import { LockOutlined, UserOutlined } from '@ant-design/icons'
import Head from 'next/head'
import useMedia from 'use-media'

const Container = styled.div`
    display: flex;
    background: #9be2fe; /* fallback */
    background-image: url(jungle.webp); /* fallback */
    background-image: url(jungle.webp), linear-gradient(to bottom, #9be2fe 0%,#67d1fb 100%);
    min-height: 100vh;
    width: 100%;
    background-size: cover;
    justify-content: center;
    align-items: center;
`

const StyledCard = styled(Card)`
    background: white;
    box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.15);
`

export default function Home() {
    const { push } = useRouter()
    const isMobile = useMedia('(max-width: 700px)')

    const handleLogin = async (values: {
        username: string
        password: string
        remember: boolean
    }) => {
        const { username, password } = values
        try {
            const { data } = await axios.post<User>('/auth', {
                username,
                password,
                type: 'normal',
            })

            const { id, auth_token, username: name, email } = data
            localStorage.setItem(
                'user',
                JSON.stringify({ id, username: name, email })
            )
            localStorage.setItem('auth-token', auth_token)
            push('/')
        } catch ({ response }) {
            const error = response?.data?._error_message
            message.error(`Login failed${error ? `: ${error}` : '.'}`)
        }
    }
    return (
        <>
            <Head>
                <title>Login</title>
                <meta
                    name="viewport"
                    content="initial-scale=1.0, width=device-width"
                />
            </Head>
            <Container>
                <StyledCard title="Into the Jungle">
                    <Form
                        layout="vertical"
                        onFinish={handleLogin}
                        initialValues={{ remember: true }}
                    >
                        <Form.Item
                            name="username"
                            label="Username"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your username!',
                                },
                            ]}
                        >
                            <Input
                                size={isMobile ? 'large' : 'middle'}
                                prefix={
                                    <UserOutlined className="site-form-item-icon" />
                                }
                                placeholder="Username"
                            />
                        </Form.Item>
                        <Form.Item
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your password!',
                                },
                            ]}
                            name="password"
                            label="Password"
                        >
                            <Input.Password
                                size={isMobile ? 'large' : 'middle'}
                                prefix={
                                    <LockOutlined className="site-form-item-icon" />
                                }
                                placeholder="Password"
                            />
                        </Form.Item>
                        <Form.Item>
                            <Form.Item
                                name="remember"
                                valuePropName="checked"
                                noStyle
                            >
                                <Checkbox>Remember me</Checkbox>
                            </Form.Item>

                            <Link href="reset-password">Forgot password?</Link>
                        </Form.Item>

                        <Form.Item>
                            <Button
                                size={isMobile ? 'large' : 'middle'}
                                htmlType="submit"
                                type="primary"
                            >
                                Log In &rarr;
                            </Button>
                        </Form.Item>
                    </Form>
                    <span>
                        Or <Link href="/register">register now!</Link>
                    </span>
                </StyledCard>
            </Container>
        </>
    )
}
