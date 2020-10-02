import { useQuery } from 'react-query'
import { useRouter } from 'next/router'
import { getProject } from '../taiga-api/projects'
import { Select, Spin } from 'antd'
import styled from 'styled-components'

const { Option } = Select

const StyledSelect = styled(Select)`
    width: 100%;
`

interface Props {
    onChange: (id: number) => void
    value: number
}

const AssigneeDropdown = ({ onChange, value }: Props) => {
    const { projectId } = useRouter().query
    const { data } = useQuery(
        ['project', { projectId }],
        (key, { projectId }) => getProject(projectId as string),
        { enabled: projectId }
    )

    return (
        <StyledSelect
            showSearch
            filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
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
