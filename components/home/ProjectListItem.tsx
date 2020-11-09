import styled from 'styled-components'
import useMedia from 'use-media'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { SettingOutlined } from '@ant-design/icons'
import { Avatar, Button, Card, Tag } from 'antd'
import { getUser, User } from '../../taiga-api/users'
import { useEffect, useState } from 'react'
import { getNameInitials } from '../../util/getNameInitials'

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

const Body = styled.div`
    padding: 20px;
`

const StyledFooter = styled.div`
    padding: 10px 20px;
    border-top: 1px solid #e5e5ea;
    display: flex;
    background: #fafafa;
    justify-content: flex-end;
`

const StyledImage = styled.img`
    border-radius: 50%;
    width: 40px;
    height: 40px;
    margin: 0px ${({ theme }) => `${theme.spacing.mini}`};
`

const ProjectName = styled.h2`
    margin: 0px;
    cursor: pointer;
    &:hover {
        text-decoration: underline;
    }
`

const ProjectDescription = styled.span`
    color: #777;
`

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

const StyledAvatar = styled(Avatar)`
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

interface Props {
    id: string | number
    name: string
    description: string
    members: number[]
    avatar?: string
}
export default function ProjectListItem({
    id,
    name,
    description,
    members,
    avatar,
}: Props) {
    const isMobile = useMedia({ maxWidth: '400px' })
    const { push } = useRouter()
    const handleSettingsClick = () => push(`/projects/${id}/settings`)

    const [actualMembers, setActualMembers] = useState<User[]>([])

    useEffect(() => {
        if (members) {
            Promise.all(
                members?.map((id) => getUser(id.toString()))
            ).then((res) => setActualMembers(res))
        }
    }, [members])

    return (
        <StyledCard bordered bodyStyle={{ padding: 0 }}>
            <Body>
                <SettingsButton
                    icon={<SettingOutlined />}
                    onClick={handleSettingsClick}
                />
                <ItemContainer>
                    <InfoContainer>
                        <StyledImage src={avatar ?? 'bmo.png'} />
                        <TextContainer>
                            <Link href={`/projects/${id}`}>
                                <ProjectName>{name}</ProjectName>
                            </Link>
                            <ProjectDescription>
                                {description}
                            </ProjectDescription>
                        </TextContainer>
                    </InfoContainer>
                    <BadgeContainer>
                        <Tag id="issues-todo">{!isMobile && 'To Do: '}16</Tag>
                        <Tag id="issues-in-progress">
                            {!isMobile && 'In Progress: '} 32
                        </Tag>
                    </BadgeContainer>
                    <MembersContainer>
                        {actualMembers.map((member) => (
                            <Link href={`/users/${member.id}`} key={member.id}>
                                <StyledAvatar src={member.photo}>
                                    {getNameInitials(member.full_name)}
                                </StyledAvatar>
                            </Link>
                        ))}
                    </MembersContainer>
                </ItemContainer>
            </Body>

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
