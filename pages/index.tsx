import styled from 'styled-components'
import Projects from '../components/home/Projects'
import Activities from '../components/home/Activities'
import useMedia from 'use-media'
import { useState } from 'react'
import YourWork from '../components/home/YourWork'
import ProjectCreationModal from '../components/home/ProjectCreationModal'
import { getMe } from '../taiga-api/users'
import PageTitle from '../components/PageTitle'
import { PageBody, PageHeader } from '../components/Layout'
import { useQuery } from 'react-query'
import { Button, Progress } from 'antd'

const Container = styled.div`
    padding: ${({ theme }) => `${theme.spacing.huge} ${theme.spacing.crazy}`};
    margin: auto;
    max-width: 1400px;
    display: flex;
    height: 100%;
    align-items: flex-start;
    @media screen and (max-width: 960px) {
        flex-direction: column;
        align-items: center;
    }
    @media screen and (max-width: 400px) {
        padding: ${({ theme }) =>
            `${theme.spacing.small} ${theme.spacing.medium}`};
    }
`

const Avatar = styled.img`
    width: 100px;
    min-width: 100px;
    height: 100px;
    min-height: 100px;
    border-radius: 50%;
    margin-right: 30px;
`

const HomeContainer = styled.div`
    padding: ${({ theme }) => theme.spacing.crazy};
    display: flex;
    justify-content: space-between;
    @media screen and (max-width: 400px) {
        padding: ${({ theme }) => theme.spacing.medium};
    }
`

const HeaderContainer = styled.div`
    display: flex;
    align-items: flex-start;
    width: 100%;
    justify-content: space-between;
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
    const { data } = useQuery('me', () => getMe())

    return (
        <>
            <PageHeader>
                <HomeContainer>
                    <Avatar src={data?.big_photo ?? 'bmo.png'} />
                    <HeaderContainer>
                        <TitleContainer>
                            <PageTitle
                                title={data?.full_name ?? ''}
                                description="Scrum Destroyer"
                            />
                            {!isMobile && (
                                <LevelContainer>
                                    <LevelIcon>5</LevelIcon>
                                    <Progress
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
                            <Button onClick={toggleModal}>New Project</Button>
                        )}
                    </HeaderContainer>
                </HomeContainer>
                {isMobile && (
                    <MobileButtonContainer>
                        <LevelContainer>
                            <LevelIcon>5</LevelIcon>
                            <Progress
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
