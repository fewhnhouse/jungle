import { Form, Select } from 'antd'
import { Dispatch, SetStateAction } from 'react'
import styled from 'styled-components'
import { Milestone } from '../../taiga-api/milestones'
import AssigneeDropdown from '../AssigneeDropdown'

const { Option } = Select
const { Item } = Form

const DateDescription = styled.span`
    font-size: 12px;
    color: #ccc;
`

export type GroupBy = 'none' | 'epic' | 'subtask' | 'assignee'

interface Props {
    groupBy: GroupBy
    setGroupBy: Dispatch<SetStateAction<GroupBy>>
    sprint: number
    setSprint: Dispatch<SetStateAction<number>>
    assignee: number
    setAssignee: Dispatch<SetStateAction<number>>
    milestones: Milestone[]
}

const FilterBoard = ({
    groupBy,
    setGroupBy,
    sprint,
    setSprint,
    assignee,
    setAssignee,
    milestones,
}: Props) => {
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
                    <Option value="epic">Epic</Option>
                    <Option value="subtask">Subtask</Option>
                </Select>
            </Item>
            <Item label="Sprints">
                <Select
                    value={sprint}
                    onChange={(value) => setSprint(value)}
                    style={{ width: 160 }}
                    placeholder="Select sprint..."
                >
                    <Option value={-1}>All</Option>
                    {milestones?.map((ms) => (
                        <Option value={ms.id} key={ms.id}>
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
                    ))}
                </Select>
            </Item>
            {groupBy !== 'assignee' && (
                <Item label="Assignee">
                    <AssigneeDropdown
                        value={assignee}
                        onChange={(id) => setAssignee(id)}
                    />
                </Item>
            )}
        </Form>
    )
}

export default FilterBoard
