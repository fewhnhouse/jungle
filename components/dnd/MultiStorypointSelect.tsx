import { Select } from 'antd'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { useQuery } from 'react-query'
import styled from 'styled-components'
import { getProject } from '../../taiga-api/projects'
import { updateUserstory, UserStory } from '../../taiga-api/userstories'
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

    const { data: project } = useQuery(
        ['project', { projectId }],
        (key, { projectId }) => getProject(projectId as string),
        { enabled: projectId }
    )

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

    const onChange = (role: number) => (value) => {
        const updatedPoints = { ...selectedPoints, [role]: value }
        setSelectedPoints(updatedPoints)
        updateUserstory(id, { points: updatedPoints, version })
    }

    return (
        <Flex fluid direction="column">
            {roles.map((role) => (
                <StyledSelect
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
