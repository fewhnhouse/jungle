import styled from 'styled-components'
import Projects from '../components/home/Projects'
import Activities from '../components/home/Activities'
import useMedia from 'use-media'
import { useState, useEffect } from 'react'
import YourWork from '../components/home/YourWork'
import { useRouter } from 'next/router'
import ProjectCreationModal from '../components/home/ProjectCreationModal'
import { Button, Progress } from 'rsuite'
import { User } from '../taiga-api/users'
import PageTitle from '../components/PageTitle'
import { PageBody, PageHeader } from '../components/Layout'
const { Line } = Progress

const Container = styled.div`
    padding: ${({ theme }) => `${theme.spacing.huge} ${theme.spacing.crazy}`};
    margin: auto;
    max-width: 1400px;
    display: flex;
    flex-wrap: wrap;
    height: 100%;
    align-items: flex-start;
    @media screen and (max-width: 400px) {
        padding: ${({ theme }) =>
            `${theme.spacing.small} ${theme.spacing.medium}`};
    }
`

const Avatar = styled.img`
    width: 100px;
    height: 100px;
    border-radius: 50%;
    margin-right: 30px;
`

const OuterContentContainer = styled.div`
    width: 100%;
    background: ${({ theme }) => theme.colors.grey.light};
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

const Title = styled.h1`
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
    const isMobile = useMedia('screen and (max-width: 845px)')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const toggleModal = () => {
        setIsModalOpen((open) => !open)
    }
    const [user, setUser] = useState<User | undefined>()

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
            <PageHeader>
                <HomeContainer>
                    <Avatar src="bmo.png" />
                    <OuterContainer>
                        <HeaderContainer>
                            <TitleContainer>
                                <PageTitle
                                    title={user?.username ?? ''}
                                    description="Scrum Destroyer"
                                />
                                {!isMobile && (
                                    <LevelContainer>
                                        <LevelIcon>5</LevelIcon>
                                        <Line
                                            strokeColor="#2ecc71"
                                            showInfo={false}
                                            percent={30}
                                            status="active"
                                        />
                                        <LevelIcon>6</LevelIcon>
                                    </LevelContainer>
                                )}
                            </TitleContainer>

                            {!isMobile && (
                                <Button onClick={toggleModal}>
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
                            <Line
                                strokeColor="#2ecc71"
                                showInfo={false}
                                percent={30}
                                status="active"
                            />

                            <LevelIcon>6</LevelIcon>
                        </LevelContainer>
                        <Button onClick={toggleModal}>New Project</Button>
                    </MobileButtonContainer>
                )}
            </PageHeader>
            <PageBody>
                <Container>
                    <Projects />
                    <InnerContainer>
                        <Activities />
                        <YourWork />
                    </InnerContainer>
                </Container>
            </PageBody>
            <ProjectCreationModal toggle={toggleModal} open={isModalOpen} />
        </>
    )
}
