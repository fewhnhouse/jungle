import styled from 'styled-components'
import Flex from './Flex'

const TitleContainer = styled.div`
    display: flex;
    flex-direction: column;
`

const Description = styled.span`
    color: #555;
`

const Avatar = styled.img`
    width: 100px;
    min-width: 100px;
    height: 100px;
    min-height: 100px;
    border-radius: 50%;
    margin-right: 30px;
`

interface Props {
    title: string
    description?: string
    avatarUrl?: string
}

const PageTitle = ({ title, description, avatarUrl }: Props) => {
    return (
        <TitleContainer>
            <Flex>
                {avatarUrl && <Avatar src={avatarUrl} />}
                <Flex direction="column">
                    <h1>{title}</h1>
                    <Description>{description}</Description>
                </Flex>
            </Flex>
        </TitleContainer>
    )
}

export default PageTitle
