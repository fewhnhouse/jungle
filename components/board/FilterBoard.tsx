import { Form, Input, Select, Tag } from 'antd'
import { Dispatch, memo, SetStateAction, useEffect } from 'react'
import styled from 'styled-components'
import { Milestone } from '../../taiga-api/milestones'
import MultiAssigneeDropdown from '../issues/MultiAssigneeDropdown'

const { Option } = Select
const { Item } = Form

const DateDescription = styled.span`
    font-size: 12px;
    color: #ccc;
`

export type GroupBy = 'none' | 'subtask' | 'assignee' | 'sprint'

interface Props {
    groupBy: GroupBy
    setGroupBy: Dispatch<SetStateAction<GroupBy>>
    sprint: number
    setSprint: Dispatch<SetStateAction<number>>
    assignees: number[]
    setAssignees: Dispatch<SetStateAction<number[]>>
    milestones: Milestone[]
    search: string
    setSearch: Dispatch<SetStateAction<string>>
}

const FilterBoard = ({
    groupBy,
    setGroupBy,
    sprint,
    setSprint,
    assignees,
    setAssignees,
    milestones,
    search,
    setSearch,
}: Props) => {
    const today = new Date()

    useEffect(() => {
        if (!!sprint && groupBy === 'sprint') {
            setGroupBy('none')
        }
    }, [sprint, groupBy])

    return (
        <Form layout="inline">
            <Item label="Group by">
                <Select
                    style={{ width: 120 }}
                    value={groupBy}
                    onChange={(value: GroupBy) => setGroupBy(value)}
                    placeholder="Group by..."
                >
                    <Option value="none">None</Option>
                    <Option value="assignee">Assignee</Option>
                    {/* <Option value="epic">Epic</Option> */}
                    <Option value="subtask">Subtask</Option>
                    {!sprint && <Option value="sprint">Sprint</Option>}
                </Select>
            </Item>
            <Item label="Sprints">
                <Select
                    allowClear
                    value={sprint}
                    onChange={(value) => setSprint(value)}
                    style={{ width: 160 }}
                    placeholder="Select sprint..."
                >
                    {milestones?.map((ms) => {
                        const start = new Date(ms.estimated_start)
                        const end = new Date(ms.estimated_finish)
                        const isActive = start <= today && today <= end

                        return (
                            <Option value={ms.id} key={ms.id}>
                                {isActive && <Tag color="blue">Active</Tag>}
                                {ms.name}

                                <br />
                                <DateDescription>
                                    {new Date(
                                        ms.estimated_start
                                    ).toLocaleDateString(undefined, {
                                        year: '2-digit',
                                        month: 'numeric',
                                        day: 'numeric',
                                    })}{' '}
                                    -{' '}
                                    {new Date(
                                        ms.estimated_finish
                                    ).toLocaleDateString(undefined, {
                                        year: '2-digit',
                                        month: 'numeric',
                                        day: 'numeric',
                                    })}
                                </DateDescription>
                            </Option>
                        )
                    })}
                </Select>
            </Item>
            {groupBy !== 'assignee' && (
                <Item label="Assignee">
                    <MultiAssigneeDropdown
                        value={assignees}
                        onChange={(id) => setAssignees(id)}
                    />
                </Item>
            )}
            <Item label="Search">
                <Input.Search
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </Item>
        </Form>
    )
}

export default memo(FilterBoard)
