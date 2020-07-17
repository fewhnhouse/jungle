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
    return (
        <>
            <Container>
                <StyledCard>
                    <CardHeader>
                        <h3>Into the Jungle</h3>
                    </CardHeader>
                    <StyledBody>
                        <StyledFormInput placeholder="username" type="text" />
                        <StyledFormInput
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
                        <StyledButton theme="success">
                            Log In &rarr;
                        </StyledButton>
                    </StyledFooter>
                </StyledCard>
            </Container>
        </>
    )
}
