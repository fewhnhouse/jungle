import { useQuery } from 'react-query'
import { useRouter } from 'next/router'
import { getProject } from '../api/projects'
import { Button, Loader, SelectPicker } from 'rsuite'
import { SyntheticEvent } from 'react'
import { ItemDataType } from 'rsuite/lib/@types/common'
import styled from 'styled-components'

const StyledSelect = styled(SelectPicker)`
    width: 100%;
`

interface Props {
    onSelect: (
        value: number,
        item: ItemDataType,
        event: SyntheticEvent<HTMLElement, Event>
    ) => void
    value: number
}

const AssigneeDropdown = ({ onSelect, value }: Props) => {
    const { projectId } = useRouter().query
    const { data } = useQuery(
        ['project', { projectId }],
        (key, { projectId }) => getProject(projectId as string),
        { enabled: projectId }
    )
    if (!data) {
        return <Loader />
    }
    return (
        <StyledSelect
            data={data?.members.map((member) => ({
                value: member.id,
                label: member.full_name,
            }))}
            value={value}
            onSelect={onSelect}
            toggleComponentClass={Button}
            appearance="default"
            title="Select..."
        />
    )
}

export default AssigneeDropdown
