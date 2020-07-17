import styled from 'styled-components'
import Projects from '../components/home/Projects'
import Activities from '../components/home/Activities'
import { Button, Modal, ModalHeader, ModalBody } from 'shards-react'
import useMedia from 'use-media'
import { useState } from 'react'
import YourWork from '../components/home/YourWork'

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
    padding-bottom: 80px;
`

const InnerContainer = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1;
`

export default function Home() {
    const isMobile = useMedia('screen and (max-width: 400px)')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const toggleModal = () => {
        setIsModalOpen((open) => !open)
    }
    return (
        <>
            <ColorContainer>
                <HomeContainer>
                    <Avatar src="bmo.png" />
                    <OuterContainer>
                        <HeaderContainer>
                            <Title>Felix Wohnhaas</Title>
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
                        <Button outline theme="dark">
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
            <Modal centered toggle={toggleModal} open={isModalOpen}>
                <ModalHeader>New Project</ModalHeader>
                <ModalBody>👋 Hello there!</ModalBody>
            </Modal>{' '}
        </>
    )
}
