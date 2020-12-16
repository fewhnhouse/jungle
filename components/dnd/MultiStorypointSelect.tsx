import { Select } from 'antd'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { useQueryCache, useQuery } from 'react-query'
import styled from 'styled-components'
import useMedia from 'use-media'
import { getProject } from '../../taiga-api/projects'
import { updateUserstory, UserStory } from '../../taiga-api/userstories'
import { updateUserstoryCache } from '../../updateCache'
import Flex from '../Flex'
const { Option } = Select

const StyledSelect = styled(Select)`
    width: 100%;
    margin: 5px 0px;
    &:first-child {
        margin-top: 0;
    }
    &:last-child {
        margin-bottom: 0;
    }
`

const MultiStoryPointCascader = ({ data }: { data: UserStory }) => {
    const { projectId } = useRouter().query
    const { version, points, id } = data
    const [selectedPoints, setSelectedPoints] = useState(points)
    const queryCache = useQueryCache()
    const { data: project } = useQuery(
        ['project', { projectId }],
        (key, { projectId }) => getProject(projectId as string),
        { enabled: projectId }
    )
    const isMobile = useMedia('(max-width: 700px)')

    const roles =
        project?.roles
            .filter((role) => role.computable)
            .map((role) => ({
                value: role.id,
                label: role.name,
                children: project?.points.map((point) => ({
                    value: point.id,
                    label: point.name,
                })),
            })) ?? []

    const onChange = (role: number) => async (value) => {
        const updatedPoints = { ...selectedPoints, [role]: value }
        setSelectedPoints(updatedPoints)
        const updatedStory = await updateUserstory(id, {
            points: updatedPoints,
            version,
        })
        updateUserstoryCache(updatedStory, id, projectId as string, queryCache)
    }

    return (
        <Flex fluid direction="column">
            {roles.map((role) => (
                <StyledSelect
                    size={isMobile ? 'large' : 'middle'}
                    value={selectedPoints[role.value]}
                    key={role.value}
                    optionLabelProp="selected"
                    onChange={onChange(role.value)}
                    placeholder={role.label}
                >
                    {role.children.map((point) => (
                        <Option
                            selected={
                                <div>
                                    {role.label}: {point.label}
                                </div>
                            }
                            key={point.value}
                            value={point.value}
                        >
                            {point.label}
                        </Option>
                    ))}
                </StyledSelect>
            ))}
        </Flex>
    )
}

export default MultiStoryPointCascader
