import AchievementBadge from '../Badge/Achievement'
import styled from 'styled-components'
import Flex from '../Flex'
import useMedia from 'use-media'
import { Skeleton } from 'antd'
import { AchievementContext, getLevel } from '../../util/AchievementWrapper'
import { useContext } from 'react'

const AchievementContainer = styled(Flex)``

const Achievements = () => {
    const isMobile = useMedia('(max-width: 700px)')
    const { achievements, isLoading } = useContext(AchievementContext)

    return (
        <AchievementContainer
            wrap
            direction="row"
            justify={isMobile ? 'center' : 'flex-start'}
            align="center"
        >
            <Skeleton active loading={isLoading}>
                {achievements
                    .sort((a, b) => {
                        const aLevel = getLevel(a.levelRange, a.score)
                        const bLevel = getLevel(b.levelRange, b.score)
                        return bLevel - aLevel
                    })
                    .map(
                        (
                            {
                                score,
                                levelRange,
                                icon,
                                title,
                                label,
                                description,
                            },
                            index
                        ) => (
                            <AchievementBadge
                                key={index}
                                description={description}
                                score={score}
                                levelRange={levelRange}
                                icon={icon}
                                title={title}
                                label={label}
                            />
                        )
                    )}
            </Skeleton>
        </AchievementContainer>
    )
}

export default Achievements
