import styled from 'styled-components'
import Link from 'next/link'
import axios from 'axios'
import { useRouter } from 'next/router'

import { User } from '../../taiga-api/users'
import { Button, Card, Checkbox, Form, Input, message } from 'antd'
import { LockOutlined, UserOutlined } from '@ant-design/icons'
import Head from 'next/head'

const Container = styled.div`
    display: flex;
    background-color: rgb(51, 99, 209);
    background-image: url(jungle.webp);
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

    const handleLogin = async (values: {
        username: string
        password: string
        remember: boolean
    }) => {
        const { username, password } = values
        try {
            const { data } = await axios.post<unknown, { data: User }>(
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
            message.error('Login failed.')
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
                    <Form.Item
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
                            <Button htmlType="submit" type="primary">
                                Log In &rarr;
                            </Button>
                        </Form.Item>
                    </Form.Item>
                </StyledCard>
            </Container>
        </>
    )
}
