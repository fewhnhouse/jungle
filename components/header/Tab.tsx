import styled from 'styled-components'
import { WrappedLink } from './Header'
import { LinkProps } from 'next/link'
import useMedia from 'use-media'

const IconWrapper = styled.div`
    margin: 0px 10px;
    display: flex;
    align-items: center;
`
interface Props extends LinkProps {
    icon: React.ReactNode
    label: React.ReactNode
}
const Tab = ({ icon, label, ...rest }: Props) => {
    const isMobile = useMedia('screen and (max-width: 900px)')

    return (
        <WrappedLink {...rest}>
            <IconWrapper>{icon}</IconWrapper>
            {!isMobile && label}
        </WrappedLink>
    )
}

export default Tab
