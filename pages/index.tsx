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
import { Button } from 'antd'

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
                    <HeaderContainer>
                        <TitleContainer>
                            <PageTitle
                                avatarUrl={data?.big_photo ?? 'bmo.png'}
                                title={data?.full_name ?? ''}
                                description="Scrum Destroyer"
                            />
                        </TitleContainer>

                        {!isMobile && (
                            <Button onClick={toggleModal}>New Project</Button>
                        )}
                    </HeaderContainer>
                </HomeContainer>
                {isMobile && (
                    <MobileButtonContainer>
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
