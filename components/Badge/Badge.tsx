import styled from 'styled-components'
import Flex from '../Flex'
import Image from 'next/image'
import { StarFilled } from '@ant-design/icons'

const BadgeShell = styled.div`
    border-radius: 8px;
    width: 100px;
    transition: transform 0.2s ease-in-out;
    &:hover {
        transform: scale(1.1);
    }
    margin: 0px 10px;
`

const Title = styled.h4`
    font-weight: 400 !important;
`

const IconContainer = styled(Flex)`
    position: absolute;
    z-index: 10;
    font-size: 20px;
    top: 24px;
    width: 55px;
    height: 55px;
    left: 14px;
    display: flex;
    justify-content: center;
    align-items: center;
`

const LevelContainer = styled(Flex)`
    margin-bottom: 5px;
`

interface IBadge {
    title: React.ReactNode
    icon: React.ReactNode
    level: 1 | 2 | 3 | 4 | 5
}

const AchievementBadge = ({ title, icon, level }: IBadge) => {
    return (
        <BadgeShell>
            <Flex direction="column" align="center">
                <LevelContainer>
                    {Array.from(Array(level).keys()).map((level) => (
                        <StarFilled key={level} style={{ color: '#f1c40f' }} />
                    ))}
                </LevelContainer>
                <div style={{ position: 'relative' }}>
                    <Image
                        style={{ position: 'absolute', zIndex: 0 }}
                        src="/medal.svg"
                        width="80px"
                        height="80px"
                    />
                    <IconContainer>{icon}</IconContainer>
                </div>
                <Title>{title}</Title>
            </Flex>
        </BadgeShell>
    )
}

export default AchievementBadge
