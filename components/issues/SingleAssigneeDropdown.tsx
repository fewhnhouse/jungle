import { useQuery } from 'react-query'
import { useRouter } from 'next/router'
import { getProject } from '../../taiga-api/projects'
import { Avatar, Select } from 'antd'
import styled from 'styled-components'
import useMedia from 'use-media'

const { Option } = Select

const StyledSelect = styled(Select)<{ fluid?: boolean }>`
    width: 100%;
`

interface Props {
    onChange: (id: number) => void
    value: number
    fluid?: boolean
}

const SingleAssigneeDropdown = ({ onChange, value, fluid }: Props) => {
    const { projectId } = useRouter().query
    const { data } = useQuery(
        ['project', { projectId }],
        (key, { projectId }) => getProject(projectId as string),
        { enabled: projectId }
    )
    const isMobile = useMedia('(max-width: 700px)')

    return (
        <StyledSelect
            allowClear
            size={isMobile ? 'large' : 'middle'}
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

export default SingleAssigneeDropdown
