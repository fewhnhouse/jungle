/* eslint-disable react/display-name */
import { DeleteOutlined } from '@ant-design/icons'
import { Table, Skeleton, Button, Popconfirm } from 'antd'

const { Column } = Table

import { useRouter } from 'next/router'
import { useQueryCache, useQuery } from 'react-query'
import { Member, Point } from '../../../taiga-api/projects'
import { deleteTag, getTags, Tag, updateTag } from '../../../taiga-api/tags'
import Flex from '../../Flex'
import EditableColorCell from '../../tablecells/ColorCell'
import EditableInputCell from '../../tablecells/InputCell'

import TagAddModal from './TagAddModal'

const Tags = () => {
    const { projectId } = useRouter().query
    const queryCache = useQueryCache()

    const { data: tags, isLoading } = useQuery(
        ['tags', { projectId }],
        (key, { projectId }) => {
            return getTags(projectId as string)
        },
        { enabled: projectId }
    )

    console.log(tags)

    const handleSave = (prevRecord: Tag) => async (
        record: Tag,
        dataIndex: string,
        value: unknown
    ) => {
        try {
            const updatedTag = await updateTag(projectId as string, {
                from_tag: prevRecord.name,
                ...(dataIndex === 'name' ? { to_tag: value as string } : {}),
                ...(dataIndex === 'color' ? { color: value as string } : {}),
            })
            queryCache.invalidateQueries(['tags', { projectId }])
            // queryCache.setQueryData(
            //     ['tags', { projectId }],
            //     (prevData: Point[]) => {
            //         return prevData?.map((item) => {
            //             if (item.id === updatedTag.id) {
            //                 return { ...item, ...updatedTag }
            //             }
            //             return item
            //         })
            //     }
            // )
        } catch (errInfo) {
            console.log('Save failed:', errInfo)
        }
    }
    const handleDelete = (tag: string) => () => {
        queryCache.setQueryData(['tags', { projectId }], (prevData: Tag[]) =>
            prevData.filter((m) => m.name !== tag)
        )
        deleteTag(projectId as string, tag)
    }

    return (
        <Skeleton loading={isLoading} active>
            <Flex justify="space-between" style={{ width: '100%' }}>
                <h2>Tags</h2>
                <TagAddModal />
            </Flex>
            <Table bordered dataSource={tags} pagination={false}>
                <Column
                    title="Color"
                    dataIndex="color"
                    render={(color: string, record: Tag) => (
                        <EditableColorCell
                            record={record as any}
                            dataIndex="color"
                            handleSave={handleSave(record)}
                        />
                    )}
                />
                <Column
                    title="Name"
                    dataIndex="name"
                    render={(name: string, record: Tag) => (
                        <EditableInputCell
                            record={record as any}
                            title="Name"
                            dataIndex="name"
                            handleSave={handleSave(record)}
                        />
                    )}
                />
                <Column
                    title="Action"
                    render={(role: number, record: Tag) => (
                        <Popconfirm
                            title={`Are you sure you want to remove this tag?`}
                            onConfirm={handleDelete(record.name)}
                        >
                            <Button danger icon={<DeleteOutlined />} />
                        </Popconfirm>
                    )}
                />
            </Table>
        </Skeleton>
    )
}

export default Tags
