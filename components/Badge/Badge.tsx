import styled from 'styled-components'
import Flex from '../Flex'
import { StarFilled } from '@ant-design/icons'
import Image from 'next/image'

const LevelContainer = styled(Flex)`
    margin-bottom: 5px;
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

const BadgeShell = styled.button<{ $isHoverable: boolean; $earned: boolean }>`
    box-shadow: rgba(0, 0, 0, 0.12) 0px 5px 10px 0px;
    border-radius: 2px;
    border: 1px solid rgb(240, 240, 240);
    background: white;
    width: 120px;
    height: 150px;
    cursor: pointer;
    filter: ${({ $earned }) => ($earned ? '' : 'grayscale(100%)')};
    transition: transform 0.2s ease-in-out;
    ${({ $isHoverable }) =>
        $isHoverable &&
        `
        &:hover {
            transform: scale(1.1);
        }
    `}
    margin: 10px;
`

const Title = styled.h4`
    font-weight: 400 !important;
`

interface BadgeProps {
    title: React.ReactNode
    icon: React.ReactNode
    level: number
}

interface ModalProps {
    onClick?: () => void
    isHoverable?: boolean
}

const Badge = ({
    onClick,
    level,
    icon,
    title,
    isHoverable,
}: BadgeProps & ModalProps) => {
    return (
        <BadgeShell
            $earned={level > 0}
            disabled={!onClick}
            $isHoverable={isHoverable}
            onClick={onClick}
        >
            <Flex direction="column" align="center">
                <LevelContainer>
                    {Array.from(Array(level).keys()).map((l) => (
                        <StarFilled key={l} style={{ color: '#f1c40f' }} />
                    ))}
                </LevelContainer>
                <div style={{ position: 'relative' }}>
                    <Image src="/medal.svg" width="80px" height="80px" />
                    <IconContainer>{icon}</IconContainer>
                </div>
                <Title>{title}</Title>
            </Flex>
        </BadgeShell>
    )
}

export default Badge
