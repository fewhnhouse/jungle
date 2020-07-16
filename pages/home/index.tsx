import styled from 'styled-components'
import ProjectCard from '../../components/home/ProjectCard'
import ActivityCard from '../../components/home/ActivityCard'
import { Button } from 'shards-react'

const Container = styled.div`
    margin: 10px;
    padding: 40px;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    height: 100%;
    align-items: flex-start;
    background: #fff;
`

const Avatar = styled.img`
    width: 100px;
    height: 100px;
    border-radius: 50%;
`

const HomeContainer = styled.div`
    width: 100%;
    padding: 60px 40px;
    display: flex;
    background: ${({ theme }) => theme.colors.grey.light};
`

const HeaderContainer = styled.div`
    display: flex;
    height: 40px;
    justify-content: space-around;
`

const OuterContainer = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
`

const Title = styled.h2`
    margin: 0px;
`

export default function Home() {
    return (
        <>
            <HomeContainer>
                <Avatar src="bmo.png" />
                <OuterContainer>
                    <HeaderContainer>
                        <Title>Felix Wohnhaas</Title>
                        <Button outline theme="dark">
                            New Project
                        </Button>
                    </HeaderContainer>
                </OuterContainer>
            </HomeContainer>
            <Container>
                <ProjectCard />
                <ActivityCard />
            </Container>
        </>
    )
}
