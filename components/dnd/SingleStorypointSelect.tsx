import { Cascader, Select, Tag, Typography } from 'antd'
import { useRouter } from 'next/router'
import { useQuery } from 'react-query'
import styled from 'styled-components'
import { getProject } from '../../taiga-api/projects'
import { Task } from '../../taiga-api/tasks'
import { updateUserstory, UserStory } from '../../taiga-api/userstories'
import Flex from '../Flex'
const { Option, OptGroup } = Select

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

const SingleStorypointSelect = ({ data }: { data: UserStory }) => {
    const { version, id } = data
    const { projectId } = useRouter().query
    const { data: project } = useQuery(
        ['project', { projectId }],
        (key, { projectId }) => getProject(projectId as string),
        { enabled: projectId }
    )

    const options =
        project?.points.map((point) => ({
            value: point.id,
            label: point.name,
        })) ?? []

    function onChange(value) {
        console.log(value)
        updateUserstory(id, { points: {}, version })
    }
    return (
        <Flex fluid direction="column">
            <StyledSelect onChange={onChange} placeholder="Select...">
                {options.map((opt) => (
                    <Option key={opt.value} value={opt.value}>
                        {opt.label}
                    </Option>
                ))}
            </StyledSelect>
        </Flex>
    )
}

export default SingleStorypointSelect
