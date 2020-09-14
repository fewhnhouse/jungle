import { useQuery } from 'react-query'
import { useRouter } from 'next/router'
import { Button, Loader, SelectPicker } from 'rsuite'
import { SyntheticEvent } from 'react'
import { ItemDataType } from 'rsuite/lib/@types/common'
import { getFiltersData } from '../api/tasks'
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

const StatusDropdown = ({ onSelect, value }: Props) => {
    const { projectId } = useRouter().query
    const { data, isLoading } = useQuery(
        ['taskFilters', { projectId }],
        (key, { projectId }) => getFiltersData(projectId as string),
        { enabled: projectId }
    )
    if (isLoading) {
        return <Loader />
    }
    return (
        <StyledSelect
            data={data?.statuses.map((status) => ({
                value: status.id,
                label: status.name,
            }))}
            value={value}
            onSelect={onSelect}
            toggleComponentClass={Button}
            appearance="default"
            title="Select..."
        />
    )
}

export default StatusDropdown
