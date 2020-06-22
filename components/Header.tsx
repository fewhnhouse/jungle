import styled from 'styled-components'
import Link, { LinkProps } from 'next/link'

const StyledHeader = styled.header`
    height: 80px;
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
`

const StyledLink = styled.a`
    padding: 10px;
    text-decoration: none;
    cursor: pointer;
`

const WrappedLink = ({
    children,
    ...rest
}: LinkProps & { children: React.ReactNode }) => (
    <Link {...rest}>
        <StyledLink>{children}</StyledLink>
    </Link>
)

const Header = () => {
    return (
        <StyledHeader>
            <WrappedLink href="/">Home</WrappedLink>
            <WrappedLink href="/your-work">Your work</WrappedLink>
            <WrappedLink href="/board">Board</WrappedLink>
            <WrappedLink href="/backlog">Backlog</WrappedLink>
            <WrappedLink href="/reports">Reports</WrappedLink>
        </StyledHeader>
    )
}

export default Header
