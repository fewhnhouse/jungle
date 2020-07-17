import {
    Card,
    CardFooter,
    Button,
    Badge,
    Modal,
    ModalHeader,
    ModalBody,
} from 'shards-react'
import styled from 'styled-components'
import useMedia from 'use-media'
import SettingsIcon from '@material-ui/icons/Settings'
import Link from 'next/link'
import { useState } from 'react'

const StyledButton = styled(Button)`
    margin: 0px 4px;
`

const StyledCard = styled(Card)`
    min-width: 300px;
    width: 100%;
    margin: ${({ theme }) => `${theme.spacing.small}`};
`

const StyledFooter = styled(CardFooter)`
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
    padding: ${({ theme }) => `${theme.spacing.medium}`};
    justify-content: space-between;
    align-items: flex-start;
    flex-direction: column;
    &:hover > #link-buttons {
        opacity: 1;
    }
`

const StyledBadge = styled(Badge)`
    margin: 0px 4px;
`

const InfoContainer = styled.div`
    margin: ${({ theme }) => `${theme.spacing.small}`} 0px;
    display: flex;
    align-items: center;
`

const SettingsButton = styled(Button)`
    position: absolute;
    width: 30px;
    height: 30px;
    right: 10px;
    top: 10px;
    padding: 0px;
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

export default function ProjectListItem() {
    const isMobile = useMedia({ maxWidth: '400px' })
    const [isModalOpen, setIsModalOpen] = useState(false)
    const toggleModal = () => setIsModalOpen((open) => !open)
    return (
        <StyledCard>
            <SettingsButton onClick={toggleModal} theme="light" outline>
                <SettingsIcon />
            </SettingsButton>
            <ItemContainer>
                <InfoContainer>
                    <StyledImage src="bmo.png" />
                    <TextContainer>
                        <ProjectName>Project 1</ProjectName>
                        <ProjectDescription>
                            This is the description
                        </ProjectDescription>
                    </TextContainer>
                </InfoContainer>
                <BadgeContainer>
                    <StyledBadge id="issues-todo" outline>
                        {!isMobile && 'To Do: '}16
                    </StyledBadge>
                    <StyledBadge id="issues-in-progress" outline theme="dark">
                        {!isMobile && 'In Progress: '} 32
                    </StyledBadge>
                </BadgeContainer>
                <Divider />
                <MembersContainer>
                    <Member src="bmo.png" />
                    <Member src="bmo.png" />
                    <Member src="bmo.png" />
                </MembersContainer>
            </ItemContainer>

            <StyledFooter>
                <Link
                    href="/projects/[id]/backlog"
                    as={`/projects/${1}/backlog`}
                >
                    <StyledButton id="dashboard" theme="dark" outline>
                        Backlog &rarr;
                    </StyledButton>
                </Link>
                <Link href="/projects/[id]/board" as={`/projects/${1}/board`}>
                    <StyledButton id="board" theme="dark" outline>
                        Board &rarr;
                    </StyledButton>
                </Link>
            </StyledFooter>
            <Modal centered toggle={toggleModal} open={isModalOpen}>
                <ModalHeader>Project Settings</ModalHeader>
                <ModalBody>👋 Hello there!</ModalBody>
            </Modal>
        </StyledCard>
    )
}
