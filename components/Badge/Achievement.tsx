import styled from 'styled-components'
import Flex from '../Flex'
import { StarFilled } from '@ant-design/icons'
import { useEffect, useState } from 'react'
import { Modal, notification, Progress } from 'antd'
import useMedia from 'use-media'
import Badge from './Badge'
import usePrev from '../../util/usePrev'

const Description = styled.p`
    margin: 10px 0px;
`

const CountStarContainer = styled.div`
    position: relative;
    &:first-child {
        margin-right: 5px;
    }
    &:last-child {
        margin-left: 5px;
    }
`

const StarLevel = styled.span`
    position: absolute;
    top: 8px;
    left: 16px;
    font-weight: bold;
`

const BadgeContainer = styled(Flex)`
    margin-bottom: 10px;
`

const DescriptionContainer = styled(Flex)`
    flex: 1;
`

interface AchievementBadgeProps {
    label: string
    description: string
    levelRange: [number, number][]
    score: number
    title: React.ReactNode
    icon: React.ReactNode
}

export const getLevel = (levelRange: [number, number][], score: number) => {
    return levelRange.findIndex((range, index) =>
        index === levelRange.length - 1
            ? true
            : score >= range[0] && score < range[1]
    )
}

const AchievementBadge = ({
    title,
    icon,
    label,
    description,
    levelRange,
    score,
}: AchievementBadgeProps) => {
    const [visible, setVisible] = useState(false)
    const handleOpen = () => setVisible(true)
    const handleClose = () => setVisible(false)
    const isMobile = useMedia('(max-width: 480px)')

    const level = getLevel(levelRange, score)

    const prevScore = usePrev(score)

    useEffect(() => {
        if (!!prevScore && score > prevScore) {
            const oldLevel = getLevel(levelRange, prevScore)
            const newLevel = getLevel(levelRange, score)
            if (newLevel > oldLevel) {
                notification.open({
                    message: `${title} Level ${level}`,
                    description: `You leveled up your ${label} Achievement!`,
                    icon,
                })
            }
        }
    }, [score, prevScore])

    const min = levelRange[level][0]
    const max = levelRange[level][1]

    return (
        <>
            <Badge
                isHoverable
                onClick={handleOpen}
                title={title}
                icon={icon}
                level={level}
            />
            <Modal
                footer={null}
                onCancel={handleClose}
                visible={visible}
                title={title}
            >
                <Flex fluid align="center" direction="column">
                    <BadgeContainer
                        fluid
                        justify="space-between"
                        align="center"
                        direction={isMobile ? 'column' : 'row'}
                    >
                        <Badge title={title} icon={icon} level={level} />
                        <DescriptionContainer direction="column" align="center">
                            <Description>{description}</Description>
                            <Flex fluid align="center" direction="column">
                                <Flex fluid align="center">
                                    <CountStarContainer>
                                        <StarFilled
                                            key={level}
                                            style={{
                                                color: '#f1c40f',
                                                fontSize: 40,
                                            }}
                                        ></StarFilled>
                                        <StarLevel>{level}</StarLevel>
                                    </CountStarContainer>
                                    <Progress
                                        showInfo={false}
                                        status="active"
                                        percent={
                                            ((score - min) * 100) / (max - min)
                                        }
                                    />
                                    <CountStarContainer>
                                        <StarFilled
                                            key={level}
                                            style={{
                                                color: '#f1c40f',
                                                fontSize: 40,
                                            }}
                                        ></StarFilled>
                                        <StarLevel>{level + 1}</StarLevel>
                                    </CountStarContainer>
                                </Flex>
                                <h3>
                                    {score} / {max} {label}
                                </h3>
                            </Flex>
                        </DescriptionContainer>
                    </BadgeContainer>
                </Flex>
            </Modal>
        </>
    )
}

export default AchievementBadge
