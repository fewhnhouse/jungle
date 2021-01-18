import styled from 'styled-components'
import Link from 'next/link'
import axios from 'axios'
import { useRouter } from 'next/router'

import { User } from '../../taiga-api/users'
import { Button, Card, Checkbox, Form, Input, message } from 'antd'
import { LockOutlined, MailOutlined, UserOutlined } from '@ant-design/icons'
import Head from 'next/head'
import useMedia from 'use-media'

const Container = styled.div`
    display: flex;
    background-color: linear-gradient(to bottom, #57c1eb 0%, #246fa8 100%);
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
    const isMobile = useMedia('(max-width: 700px)')

    const handleLogin = async (values: {
        username: string
        password: string
        email: string
        fullName: string
        terms: boolean
    }) => {
        const { username, password, email, fullName, terms } = values
        try {
            const { data } = await axios.post<User>('/auth/register', {
                accepted_terms: terms,
                username,
                full_name: fullName,
                password,
                email,
                fullName,
                type: 'public',
            })

            const { id, auth_token, username: name, email: mail } = data
            localStorage.setItem(
                'user',
                JSON.stringify({ id, username: name, email: mail })
            )
            localStorage.setItem('auth-token', auth_token)
            push('/')
        } catch ({ response }) {
            const error = response?.data?._error_message
            message.error(`Register failed${error ? `: ${error}` : '.'}`)
        }
    }
    return (
        <>
            <Head>
                <title>Register</title>
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
                                prefix={<UserOutlined />}
                                placeholder="Username"
                            />
                        </Form.Item>
                        <Form.Item
                            name="fullName"
                            label="Full Name"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your full name!',
                                },
                            ]}
                        >
                            <Input
                                size={isMobile ? 'large' : 'middle'}
                                prefix={<UserOutlined />}
                                placeholder="Full Name"
                            />
                        </Form.Item>
                        <Form.Item
                            name="email"
                            label="Email"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your email!',
                                },
                            ]}
                        >
                            <Input
                                size={isMobile ? 'large' : 'middle'}
                                type="email"
                                prefix={<MailOutlined />}
                                placeholder="Email"
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
                                prefix={<LockOutlined />}
                                placeholder="Password"
                            />
                        </Form.Item>
                        <Form.Item
                            name="terms"
                            valuePropName="checked"
                            rules={[
                                {
                                    validator: (_, value) =>
                                        value
                                            ? Promise.resolve()
                                            : Promise.reject(
                                                  'Please accept Terms and Conditions'
                                              ),
                                },
                            ]}
                        >
                            <Checkbox>
                                Accept{' '}
                                <Link href="/terms">Terms and Conditions</Link>
                            </Checkbox>
                        </Form.Item>

                        <Form.Item>
                            <Button
                                size={isMobile ? 'large' : 'middle'}
                                htmlType="submit"
                                type="primary"
                            >
                                Register &rarr;
                            </Button>
                        </Form.Item>
                    </Form>
                    <span>
                        Or <Link href="/login">login now!</Link>
                    </span>
                </StyledCard>
            </Container>
        </>
    )
}
