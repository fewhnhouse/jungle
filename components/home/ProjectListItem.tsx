import styled from 'styled-components'
import useMedia from 'use-media'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { SettingOutlined } from '@ant-design/icons'
import { Button, Card, Tag } from 'antd'

const StyledButton = styled(Button)`
    margin: 0px 4px;
`

const StyledCard = styled(Card)`
    min-width: 300px;
    max-width: 500px;
    background: white;
    width: 100%;
    margin: ${({ theme }) => `${theme.spacing.medium}`};
`

const StyledFooter = styled.div`
    padding: 10px;
    display: flex;
    justify-content: flex-end;
`

const StyledImage = styled.img`
    border-radius: 50%;
    width: 40px;
    height: 40px;
    margin: 0px ${({ theme }) => `${theme.spacing.mini}`};
`

const ProjectName = styled.h5`
    margin: 0px;
`

const ProjectDescription = styled.span``

const TextContainer = styled.div`
    margin: 0px ${({ theme }) => `${theme.spacing.medium}`};
    display: flex;
    flex-direction: column;
`

const ItemContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    flex-direction: column;
    &:hover > #link-buttons {
        opacity: 1;
    }
`

const InfoContainer = styled.div`
    margin: ${({ theme }) => `${theme.spacing.small}`} 0px;
    display: flex;
    align-items: center;
`

const SettingsButton = styled(Button)`
    float: right;
`

const MembersContainer = styled.div`
    display: flex;
    margin: ${({ theme }) => `${theme.spacing.mini}`} 0px;
`

const Member = styled.img`
    width: 30px;
    height: 30px;
    border-radius: 50%;
    margin: 0px 2px;
    transition: box-shadow 0.3s ease-in-out;
    cursor: pointer;
    &:hover {
        box-shadow: rgba(0, 0, 0, 0.5) 0px 0px 5px 0px;
    }
`

const BadgeContainer = styled.div`
    width: 100%;
    margin: ${({ theme }) => `${theme.spacing.mini}`} 0px;
    display: flex;
`

const Divider = styled.div`
    border-bottom: 1px solid rgba(0, 0, 0, 0.125);
    width: 100%;
    margin: ${({ theme }) => `${theme.spacing.medium}`} 0px;
`

interface Props {
    id: string | number
    name: string
    description: string
    avatar?: string
}
export default function ProjectListItem({
    id,
    name,
    description,
    avatar,
}: Props) {
    const isMobile = useMedia({ maxWidth: '400px' })
    const { push } = useRouter()
    const handleSettingsClick = () => push(`/projects/${id}/settings`)
    return (
        <StyledCard bordered>
            <SettingsButton
                icon={<SettingOutlined />}
                onClick={handleSettingsClick}
            />
            <ItemContainer>
                <InfoContainer>
                    <StyledImage src={avatar ?? 'bmo.png'} />
                    <TextContainer>
                        <ProjectName>{name}</ProjectName>
                        <ProjectDescription>{description}</ProjectDescription>
                    </TextContainer>
                </InfoContainer>
                <BadgeContainer>
                    <Tag id="issues-todo" outline>
                        {!isMobile && 'To Do: '}16
                    </Tag>
                    <Tag id="issues-in-progress" outline theme="dark">
                        {!isMobile && 'In Progress: '} 32
                    </Tag>
                </BadgeContainer>
                <Divider />
                <MembersContainer>
                    <Member src="bmo.png" />
                    <Member src="bmo.png" />
                    <Member src="bmo.png" />
                </MembersContainer>
            </ItemContainer>

            <StyledFooter>
                <Link href={`/projects/${id}/backlog`}>
                    <StyledButton id="dashboard">Backlog &rarr;</StyledButton>
                </Link>
                <Link href={`/projects/${id}/board`}>
                    <StyledButton id="board">Board &rarr;</StyledButton>
                </Link>
            </StyledFooter>
        </StyledCard>
    )
}
