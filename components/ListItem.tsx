import styled from 'styled-components'
import { Theme } from '../pages/_app'

const Container = styled.li<{ theme: Theme }>`
    background: ${({ theme }) => theme.colors.grey.light};
    border-radius: 4px;
    list-style: none;
    min-width: 400px;
    max-width: 500px;
    margin: ${({ theme }) => theme.spacing.mini} 0px;
    &:hover {
        background: ${({ theme }) => theme.colors.grey.normal};
    }
`

interface Props {
    children: React.ReactNode
}
export default function ListItem({ children }: Props) {
    return <Container>{children}</Container>
}
