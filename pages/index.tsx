import styled from 'styled-components'
import Projects from '../components/home/Projects'
import Activities from '../components/home/Activities'
import { Button, Modal, ModalHeader, ModalBody, Progress } from 'shards-react'
import useMedia from 'use-media'
import { useState, useEffect } from 'react'
import YourWork from '../components/home/YourWork'
import useSWR from 'swr'
import { IProject } from '../interfaces/Project'
import { useRouter } from 'next/router'
import Axios from 'axios'
import ProjectCreationModal from '../components/home/ProjectCreationModal'

const Container = styled.div`
    padding: ${({ theme }) => `${theme.spacing.huge} ${theme.spacing.crazy}`};
    margin: auto;
    max-width: 1400px;
    display: flex;
    flex-wrap: wrap;
    height: 100%;
    align-items: flex-start;
    background: #fff;
    @media screen and (max-width: 400px) {
        padding: ${({ theme }) =>
            `${theme.spacing.small} ${theme.spacing.medium}`};
    }
`

const ColorContainer = styled.div`
    background: ${({ theme }) => theme.colors.grey.light};
`

const Avatar = styled.img`
    width: 100px;
    height: 100px;
    border-radius: 50%;
    margin-right: 30px;
`

const HomeContainer = styled.div`
    width: 100%;
    padding: ${({ theme }) => theme.spacing.crazy};
    margin: auto;
    max-width: 1400px;
    display: flex;
    justify-content: space-between;
    @media screen and (max-width: 400px) {
        padding: ${({ theme }) => theme.spacing.medium};
    }
`

const HeaderContainer = styled.div`
    display: flex;
    height: 40px;
    justify-content: space-between;
`

const OuterContainer = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: space-between;
`

const Title = styled.h2`
    margin: 0px;
`

const MobileButtonContainer = styled.div`
    padding: ${({ theme }) => theme.spacing.medium};
    padding-top: 0px;
    padding-bottom: 80px;
`

const InnerContainer = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1;
`

const LevelContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: ${({ theme }) => theme.spacing.small} 0px;
`

const StyledProgress = styled(Progress)`
    width: 90%;
    margin: 0;
`

const LevelIcon = styled.div`
    background: #2ecc71;
    border-radius: 50%;
    width: 30px;
    min-width: 30px;
    height: 30px;
    min-height: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    &:first-child {
        margin-right: ${({ theme }) => theme.spacing.mini};
    }
    &:last-child {
        margin-left: ${({ theme }) => theme.spacing.mini};
    }
`

const TitleContainer = styled.div`
    display: flex;
    flex: 3;
    flex-direction: column;
    margin-right: ${({ theme }) => theme.spacing.medium};
`

export default function Home() {
    const isMobile = useMedia('screen and (max-width: 400px)')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const toggleModal = () => {
        setIsModalOpen((open) => !open)
    }
    const [user, setUser] = useState()

    const { push } = useRouter()

    useEffect(() => {
        const userString = localStorage.getItem('user')
        const user = JSON.parse(userString)
        if (!user) {
            push('/login')
        }
        setUser(user)
    }, [])

    return (
        <>
            <ColorContainer>
                <HomeContainer>
                    <Avatar src="bmo.png" />
                    <OuterContainer>
                        <HeaderContainer>
                            <TitleContainer>
                                <Title>{user?.username}</Title>
                                <span>Scrum Destroyer</span>
                                {!isMobile && (
                                    <LevelContainer>
                                        <LevelIcon>5</LevelIcon>
                                        <StyledProgress
                                            barClassName="level-bar"
                                            theme="success"
                                            value={50}
                                        />
                                        <LevelIcon>6</LevelIcon>
                                    </LevelContainer>
                                )}
                            </TitleContainer>

                            {!isMobile && (
                                <Button
                                    onClick={toggleModal}
                                    outline
                                    theme="dark"
                                >
                                    New Project
                                </Button>
                            )}
                        </HeaderContainer>
                    </OuterContainer>
                </HomeContainer>
                {isMobile && (
                    <MobileButtonContainer>
                        <LevelContainer>
                            <LevelIcon>5</LevelIcon>
                            <StyledProgress
                                barClassName="level-bar"
                                theme="success"
                                value={50}
                            />
                            <LevelIcon>6</LevelIcon>
                        </LevelContainer>
                        <Button onClick={toggleModal} outline theme="dark">
                            New Project
                        </Button>
                    </MobileButtonContainer>
                )}
            </ColorContainer>
            <Container>
                <Projects />
                <InnerContainer>
                    <Activities />
                    <YourWork />
                </InnerContainer>
            </Container>
            <ProjectCreationModal toggle={toggleModal} open={isModalOpen} />
        </>
    )
}

export async function getServerSideProps(context) {
    const { data } = await Axios.get(
        'https://motius.taiga.apps.moti.us/api/v1/projects'
    )
    return {
        props: {},
    }
}
