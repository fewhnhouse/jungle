import { Card, CardBody, CardFooter, Button } from 'shards-react'
import styled from 'styled-components'

export const StyledCard = styled(Card)`
    flex: 1;
    margin: 16px;
    min-width: 500px;

    @media screen and (max-width: 400px) {
        min-width: 300px;
        margin: 8px;
    }
`

export const StyledFooter = styled(CardFooter)`
    display: flex;
    justify-content: flex-end;
`

export const ScrollableCardBody = styled(CardBody)`
    max-height: 300px;
    overflow: auto;
    @media screen and (max-width: 400px) {
        padding: 10px;
    }
`

export const List = styled.ul`
    margin: 0px;
    padding: 0px;
`

export const StyledButton = styled(Button)`
    margin: 0px 5px;
`
