import styled from 'styled-components'
import Link, { LinkProps } from 'next/link'
import { useScrollPosition } from '../../util/useScrollPosition'
import { FormInput, InputGroup } from 'shards-react'
import Notifications from './Notifications'
import Profile from './Profile'
import { useRouter } from 'next/router'

const StyledHeader = styled.header`
    height: 60px;
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    position: fixed;
    top: 0px;
    background-color: white;
    z-index: 100;
    box-shadow: ${({ scrolled }: { scrolled: boolean }) =>
        scrolled ? 'rgba(0, 0, 0, 0.5) 0px 0px 15px 0px' : ''};
    transition: box-shadow 0.3s ease-in-out;
`

const StyledLink = styled.a`
    padding: 10px;
    text-decoration: none;
    cursor: pointer;
`

const Links = styled.div`
    display: flex;
`

const Options = styled.div`
    display: flex;
    align-items: center;
`

const StyledInputGroup = styled(InputGroup)`
    margin: 0px 5px;
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
    const router = useRouter()
    const { pathname, query } = router
    const { id } = query

    const { y } = useScrollPosition()
    return (
        <StyledHeader scrolled={y > 0}>
            {pathname.includes('/projects') ? (
                <Links>
                    <WrappedLink href="/projects/[id]" as={`/projects/${id}`}>
                        Dashboard
                    </WrappedLink>
                    <WrappedLink href="/projects/[id]/your-work" as={`/projects/${id}/your-work`}>
                        Your work
                    </WrappedLink>
                    <WrappedLink href="/projects/[id]/board" as={`/projects/${id}/board`}>Board</WrappedLink>
                    <WrappedLink href="/projects/[id]/backlog" as={`/projects/${id}/backlog`}>Backlog</WrappedLink>
                    <WrappedLink href="/projects/[id]/reports" as={`/projects/${id}/reports`}>Reports</WrappedLink>
                </Links>
            ) : (
                <Links>
                    <WrappedLink href="/">Dashboard</WrappedLink>
                    <WrappedLink href="/projects">Projects</WrappedLink>
                    <WrappedLink href="/activity">Activity</WrappedLink>
                    <WrappedLink href="/your-work">Your Work</WrappedLink>
                </Links>
            )}

            <Options>
                <StyledInputGroup>
                    <FormInput placeholder="Search..." />
                </StyledInputGroup>
                <Notifications />
                <Profile />
            </Options>
        </StyledHeader>
    )
}

export default Header
