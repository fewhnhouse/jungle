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

const BadgeShell = styled.button<{ $isHoverable }>`
    border-radius: 8px;
    border: 1px solid #333;
    background: #eee;
    width: 120px;
    height: 140px;
    cursor: pointer;
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

export default Badge
