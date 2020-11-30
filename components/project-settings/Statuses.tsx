import { CheckOutlined, CloseOutlined, DeleteOutlined } from '@ant-design/icons'
import { Table, Tag, Space, Skeleton, Input, Form, Button } from 'antd'

const { Column, ColumnGroup } = Table

import { useRouter } from 'next/router'
import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { queryCache, useQuery } from 'react-query'

import styled from 'styled-components'
import { getProject } from '../../taiga-api/projects'
import { getTaskStatuses } from '../../taiga-api/tasks'
import { getUserstoryStatuses } from '../../taiga-api/userstories'
import Flex from '../Flex'

const EditableContext = createContext<any>()

interface Item {
    key: string
    name: string
    age: string
    address: string
}

interface EditableRowProps {
    index: number
}

const EditableRow: React.FC<EditableRowProps> = ({ index, ...props }) => {
    const [form] = Form.useForm()
    return (
        <Form form={form} component={false}>
            <EditableContext.Provider value={form}>
                <tr {...props} />
            </EditableContext.Provider>
        </Form>
    )
}

interface EditableCellProps {
    title: React.ReactNode
    editable: boolean
    children: React.ReactNode
    dataIndex: string
    record: Item
    handleSave: (record: Item) => void
}

const EditableCell: React.FC<EditableCellProps> = ({
    title,
    editable,
    children,
    dataIndex,
    record,
    handleSave,
    ...restProps
}) => {
    const [editing, setEditing] = useState(false)
    const inputRef = useRef()
    const form = useContext(EditableContext)

    useEffect(() => {
        if (editing) {
            inputRef?.current?.focus()
        }
    }, [editing])

    const toggleEdit = () => {
        setEditing(!editing)
        form.setFieldsValue({ [dataIndex]: record[dataIndex] })
    }

    const save = async (e) => {
        try {
            const values = await form.validateFields()

            toggleEdit()
            handleSave({ ...record, ...values })
        } catch (errInfo) {
            console.log('Save failed:', errInfo)
        }
    }

    let childNode = children

    if (editable) {
        childNode = editing ? (
            <Form.Item
                style={{ margin: 0 }}
                name={dataIndex}
                rules={[
                    {
                        required: true,
                        message: `${title} is required.`,
                    },
                ]}
            >
                <Input ref={inputRef} onPressEnter={save} onBlur={save} />
            </Form.Item>
        ) : (
            <div
                className="editable-cell-value-wrap"
                style={{ paddingRight: 24 }}
                onClick={toggleEdit}
            >
                {children}
            </div>
        )
    }

    return <td {...restProps}>{childNode}</td>
}

const Statuses = () => {
    const { query, replace } = useRouter()
    const { projectId } = query

    const { data: taskStatuses, isLoading: taskStatusesIsLoading } = useQuery(
        ['taskStatuses', { projectId }],
        async (key, { projectId }) => {
            return getTaskStatuses(projectId as string)
        },
        { enabled: projectId }
    )
    const {
        data: userstoryStatuses,
        isLoading: userstoryStatusesIsLoading,
    } = useQuery(
        ['userstoryStatuses', { projectId }],
        async (key, { projectId }) => {
            return getUserstoryStatuses(projectId as string)
        },
        { enabled: projectId }
    )

    const components = {
        body: {
            row: EditableRow,
            cell: EditableCell,
        },
    }

    const columns = [
        {
            title: 'Color',
            dataIndex: 'color',
            // eslint-disable-next-line react/display-name
            render: (color: string) => (
                <Tag color={color} key={color}>
                    {color}
                </Tag>
            ),
            editable: true,
        },
        {
            title: 'Name',
            dataIndex: 'name',
            editable: true,
        },
        {
            title: 'Closed',
            dataIndex: 'is_closed',
            // eslint-disable-next-line react/display-name
            render: (closed: boolean) =>
                closed ? <CheckOutlined /> : <CloseOutlined />,
        },
        {
            title: 'Action',
            render: (_, record) => (
                <Button icon={<DeleteOutlined />} link danger></Button>
            ),
        },
    ]

    const handleSave = () => {
        console.log('save')
    }

    const editableColumns = columns.map((col) => {
        if (!col.editable) {
            return col
        }
        return {
            ...col,
            onCell: (record) => ({
                record,
                editable: col.editable,
                dataIndex: col.dataIndex,
                title: col.title,
                handleSave,
            }),
        }
    })

    return (
        <Skeleton
            loading={taskStatusesIsLoading || userstoryStatusesIsLoading}
            active
        >
            <Table
                components={components}
                rowClassName={() => 'editable-row'}
                bordered
                dataSource={taskStatuses}
                columns={editableColumns}
                pagination={false}
            />
        </Skeleton>
    )
}

export default Statuses
