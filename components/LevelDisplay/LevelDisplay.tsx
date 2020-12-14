import { InfoCircleOutlined } from '@ant-design/icons'
import { Progress, Tooltip } from 'antd'
import { useContext } from 'react'
import styled from 'styled-components'
import { AchievementContext, getLevel } from '../../util/AchievementWrapper'
import Flex from '../Flex'

const LevelContainer = styled.div`
    display: flex;
    width: 100%;
    justify-content: space-between;
    align-items: center;
    margin: 8px 0px;
`

const LevelIcon = styled.div<{ $size: 'normal' | 'small' }>`
    background: #2ecc71;
    border-radius: 50%;
    font-size: ${({ $size }) => ($size === 'normal' ? '24px' : '16px')};
    font-weight: bold;
    width: ${({ $size }) => ($size === 'normal' ? '40px' : '24px')};
    min-width: ${({ $size }) => ($size === 'normal' ? '40px' : '24px')};
    height: ${({ $size }) => ($size === 'normal' ? '40px' : '24px')};
    min-height: ${({ $size }) => ($size === 'normal' ? '40px' : '24px')};
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    &:first-child {
        margin-right: 4px;
    }
    &:last-child {
        margin-left: 4px;
    }
`

const Score = styled.h3``

const Container = styled(Flex)<{ $size: 'normal' | 'small' }>`
    margin: ${({ $size }) => ($size === 'normal' ? '20px 0px' : '5px 0px')};
`

const LevelDisplay = ({
    size = 'normal',
    totalLevelRange,
    totalScore,
}: {
    size?: 'small' | 'normal'
    totalLevelRange?: [number, number][]
    totalScore?: number
}) => {
    const { totalLevelRange: ctxRange, totalScore: ctxScore } = useContext(
        AchievementContext
    )
    totalLevelRange = totalLevelRange ?? ctxRange
    totalScore = totalScore ?? ctxScore
    const currentLevel = getLevel(totalLevelRange, totalScore)
    const percent =
        totalLevelRange.length > 1
            ? ((totalScore - totalLevelRange[currentLevel][0]) /
                  totalLevelRange[currentLevel][1]) *
              100
            : 0
    return (
        <Container $size={size} fluid direction="column" align="center">
            <LevelContainer>
                <LevelIcon $size={size}>{currentLevel}</LevelIcon>
                <Progress
                    strokeColor="#2ecc71"
                    showInfo={false}
                    percent={percent}
                    status="active"
                />
                <LevelIcon $size={size}>{currentLevel + 1}</LevelIcon>
            </LevelContainer>
            {size === 'normal' && (
                <Score>
                    {totalScore}{' '}
                    {totalLevelRange.length > 1
                        ? `/ ${totalLevelRange[currentLevel][1]} `
                        : ' '}
                    Points{' '}
                    <Tooltip
                        title={`Your Team Level is currently ${currentLevel}. Complete tasks, finish Sprints and collaborate as a Team to gain experience towards the next level!`}
                    >
                        <InfoCircleOutlined />
                    </Tooltip>
                </Score>
            )}
        </Container>
    )
}

export default LevelDisplay
