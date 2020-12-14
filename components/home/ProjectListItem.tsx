import styled from 'styled-components'
import Link from 'next/link'
import {
    EyeFilled,
    EyeOutlined,
    LikeFilled,
    LikeOutlined,
    LockOutlined,
    SettingOutlined,
    UnlockOutlined,
} from '@ant-design/icons'
import { Avatar, Button, Card, Skeleton, Tooltip } from 'antd'
import { getMe, getUser, User } from '../../taiga-api/users'
import { getNameInitials } from '../../util/getNameInitials'
import Flex from '../Flex'
import { useQuery } from 'react-query'

const StyledButton = styled(Button)`
    margin: 0px 4px;
`

const StyledCard = styled(Card)`
    min-width: 300px;
    max-width: 500px;
    background: white;
    width: 100%;
    margin: ${({ theme }) => `${theme.spacing.medium}`};
    box-shadow: rgba(0, 0, 0, 0.12) 0px 5px 10px 0px;
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

const ProjectName = styled.a`
    margin: 0px;
    color: #333;
    &:hover {
        color: #555;
    }
    font-size: 21px;
    cursor: pointer;
    &:hover {
        text-decoration: underline;
    }
`

const ProjectDescription = styled.span`
    color: #666;
    min-height: 50px;
    display: block;
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

const StyledLock = styled(LockOutlined)`
    margin-left: 10px;
    font-size: 14px;
`

const StyledUnlock = styled(UnlockOutlined)`
    margin-left: 10px;
    font-size: 14px;
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
    button {
        span {
            margin-right: 5px;
        }
        &:first-child {
            margin-right: 5px;
        }
    }
`

interface Props {
    id: string | number
    name: string
    description: string
    members: number[]
    avatar?: string
    fans: number
    watchers: number
    isPrivate?: boolean
    isFan?: boolean
    isWatcher?: boolean
}
export default function ProjectListItem({
    id,
    name,
    description,
    members = [],
    avatar,
    isPrivate,
    fans,
    watchers,
    isFan,
    isWatcher,
}: Props) {
    const { data: me } = useQuery('me', () => getMe())
    const { data: actualMembers, isLoading } = useQuery(
        ['actualMembers', { members }],
        (key, { members }) =>
            Promise.all(
                members?.map(
                    async (userId: number) => await getUser(userId.toString())
                )
            )
    )

    return (
        <StyledCard bordered bodyStyle={{ padding: 0 }}>
            <Body>
                {members.includes(me?.id) && (
                    <Link href={`/projects/${id}/settings`} passHref>
                        <SettingsButton icon={<SettingOutlined />} />
                    </Link>
                )}
                <ItemContainer>
                    <InfoContainer>
                        <StyledImage
                            alt="Project Avatar"
                            src={avatar ?? '/placeholder.webp'}
                        />
                        <TextContainer>
                            <Flex align="center">
                                <Link href={`/projects/${id}`} passHref>
                                    <ProjectName>{name}</ProjectName>
                                </Link>
                                <Tooltip
                                    title={`This project is ${
                                        isPrivate ? 'private' : 'public'
                                    }`}
                                >
                                    {isPrivate ? (
                                        <StyledLock />
                                    ) : (
                                        <StyledUnlock />
                                    )}
                                </Tooltip>
                            </Flex>
                            <ProjectDescription>
                                {description}
                            </ProjectDescription>
                        </TextContainer>
                    </InfoContainer>
                    <BadgeContainer>
                        <Button
                            type={isFan ? 'primary' : 'default'}
                            size="small"
                            icon={isFan ? <LikeFilled /> : <LikeOutlined />}
                        >
                            {fans}
                        </Button>
                        <Button
                            type={isWatcher ? 'primary' : 'default'}
                            size="small"
                            icon={isWatcher ? <EyeFilled /> : <EyeOutlined />}
                        >
                            {watchers}
                        </Button>
                    </BadgeContainer>
                    <MembersContainer>
                        {isLoading && <Skeleton.Avatar active />}
                        {actualMembers?.map((member: User) => (
                            <Link
                                passHref
                                href={`/users/${member.id}`}
                                key={member.id}
                            >
                                <StyledAvatar src={member.photo}>
                                    {getNameInitials(member.full_name)}
                                </StyledAvatar>
                            </Link>
                        ))}
                    </MembersContainer>
                </ItemContainer>
            </Body>

            <StyledFooter>
                <Link passHref href={`/projects/${id}/backlog`}>
                    <StyledButton>Backlog &rarr;</StyledButton>
                </Link>
                <Link passHref href={`/projects/${id}/board`}>
                    <StyledButton>Board &rarr;</StyledButton>
                </Link>
            </StyledFooter>
        </StyledCard>
    )
}
