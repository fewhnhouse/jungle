import { Breadcrumb, Divider } from 'antd'
import Link from 'next/link'
import styled from 'styled-components'
import useMedia from 'use-media'
import Flex from './Flex'

const Description = styled.span`
    color: #555;
`

const Avatar = styled.img`
    width: 100px;
    min-width: 100px;
    height: 100px;
    min-height: 100px;
    border-radius: 50% !important;
    margin-right: 30px;
    @media (max-width: 480px) {
        width: 50px;
        min-width: 50px;
        height: 50px;
        min-height: 50px;
        margin-right: 20px;
    }
`

const TitleContainer = styled(Flex)`
    width: 100%;
    margin-bottom: 10px;
`

interface Props {
    title: React.ReactNode
    description?: React.ReactNode
    avatarUrl?: string
    actions?: React.ReactNode
    breadcrumbs?: { label: string; href: string }[]
}

const PageTitle = ({
    title,
    description,
    avatarUrl,
    actions,
    breadcrumbs,
}: Props) => {
    const isMobile = useMedia('screen and (max-width: 700px)')
    return (
        <Flex
            direction={isMobile ? 'column' : 'row'}
            fluid
            align="center"
            justify="space-between"
        >
            <TitleContainer>
                {avatarUrl && <Avatar alt="Avatar" src={avatarUrl} />}
                <Flex direction="column">
                    <Breadcrumb>
                        {breadcrumbs?.map(({ label, href }, index) => (
                            <Breadcrumb.Item key={index}>
                                <Link href={href}>
                                    <a>{label}</a>
                                </Link>
                            </Breadcrumb.Item>
                        ))}
                    </Breadcrumb>
                    <h1>{title}</h1>
                    <Description>{description}</Description>
                </Flex>
            </TitleContainer>
            {!!actions && isMobile && <Divider />}
            <Flex direction={isMobile ? 'row' : 'column'}>{actions}</Flex>
        </Flex>
    )
}

export default PageTitle
