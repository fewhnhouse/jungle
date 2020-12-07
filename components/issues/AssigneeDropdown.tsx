import { useQuery } from 'react-query'
import { useRouter } from 'next/router'
import { getProject } from '../../taiga-api/projects'
import { Avatar, Select } from 'antd'
import styled from 'styled-components'

const { Option } = Select

const StyledSelect = styled(Select)<{ fluid?: boolean }>`
    width: 100%;
`

interface Props {
    onChange: (ids: number[]) => void
    value: number[]
    fluid?: boolean
}

const StyledAvatar = styled(Avatar)`
    margin-right: 5px;
`

const AssigneeDropdown = ({ onChange, value, fluid }: Props) => {
    const { projectId } = useRouter().query
    const { data } = useQuery(
        ['project', { projectId }],
        (key, { projectId }) => getProject(projectId as string),
        { enabled: projectId }
    )

    return (
        <StyledSelect
            allowClear
            style={{ width: 160 }}
            mode="multiple"
            placeholder="Assignee..."
            fluid={fluid}
            showSearch
            filterOption={(input, option) =>
                option.title.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            loading={!data}
            onChange={onChange}
            value={value}
        >
            {data?.members.map((member) => (
                <Option
                    title={member.full_name}
                    key={member.id}
                    value={member.id}
                >
                    {member.full_name}
                </Option>
            ))}
        </StyledSelect>
    )
}

export default AssigneeDropdown
