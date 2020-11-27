import { InfoCircleOutlined } from '@ant-design/icons'
import { Progress, Tooltip } from 'antd'
import { useContext } from 'react'
import styled from 'styled-components'
import { AchievementContext } from '../../util/AchievementWrapper'
import { getLevel } from '../Badge/Achievement'
import Flex from '../Flex'

const LevelContainer = styled.div`
    display: flex;
    width: 100%;
    justify-content: space-between;
    align-items: center;
    margin: ${({ theme }) => theme.spacing.small} 0px;
`

const LevelIcon = styled.div`
    background: #2ecc71;
    border-radius: 50%;
    font-size: 24px;
    font-weight: bold;
    width: 40px;
    min-width: 40px;
    height: 40px;
    min-height: 40px;
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

const Score = styled.h3``

const Container = styled(Flex)`
    margin: 20px 0px;
`

const LevelDisplay = () => {
    const { totalLevelRange, totalScore } = useContext(AchievementContext)
    const currentLevel = getLevel(totalLevelRange, totalScore)
    const percent =
        ((totalScore - totalLevelRange[currentLevel][0]) /
            totalLevelRange[currentLevel][1]) *
        100
    return (
        <Container fluid direction="column" align="center">
            <LevelContainer>
                <LevelIcon>{currentLevel}</LevelIcon>
                <Progress
                    strokeColor="#2ecc71"
                    showInfo={false}
                    percent={percent}
                    status="active"
                />
                <LevelIcon>{currentLevel + 1}</LevelIcon>
            </LevelContainer>
            <Score>
                {totalScore} / {totalLevelRange[currentLevel][1]} Points{' '}
                <Tooltip
                    title="Your Team Level is currently 5. Complete tasks, finish Sprints
                and collaborate as a Team to gain experience towards the next
                level!"
                >
                    <InfoCircleOutlined />
                </Tooltip>
            </Score>
        </Container>
    )
}

export default LevelDisplay
