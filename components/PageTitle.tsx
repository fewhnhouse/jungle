import styled from 'styled-components'

const TitleContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 840px;
    margin: auto;
`

const Description = styled.span`
    color: #555;
`

interface Props {
    title: string
    description?: string
}

const PageTitle = ({ title, description }: Props) => {
    return (
        <TitleContainer>
            <h1>{title}</h1>
            <Description>{description}</Description>
        </TitleContainer>
    )
}

export default PageTitle
