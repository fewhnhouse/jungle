import { Select, Tag } from 'antd'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { queryCache, useQuery } from 'react-query'
import styled from 'styled-components'
import { getTagColors, TagObject } from '../../taiga-api/projects'
import { getTask, Task } from '../../taiga-api/tasks'
import {
    getUserstory,
    updateUserstory,
    UserStory,
} from '../../taiga-api/userstories'

const StyledTagPicker = styled(Select)`
    width: 100%;
`

interface Props {
    id: number
    type: 'task' | 'userstory'
}
const CustomTagPicker = ({ id, type }: Props) => {
    const { isLoading, data, isError } = useQuery<Task | UserStory>(
        [type, { id }],
        (key, { id }) => (type === 'task' ? getTask(id) : getUserstory(id))
    )

    const mappedSelectedTags = data?.tags?.map((tag) => tag[0]) ?? []
    const [selected, setSelected] = useState(mappedSelectedTags)
    const [isUpdating, setIsUpdating] = useState(false)
    const { projectId } = useRouter().query
    const { data: tags } = useQuery(
        ['tags', { projectId }],
        (key, { projectId }) => getTagColors(projectId as string),
        { enabled: projectId }
    )
    const tagsArray = tags
        ? Object.keys(tags).map((key) => ({
              label: key,
              value: key,
              color: tags[key],
          }))
        : []

    const handleChange = async (newTags: string[] | undefined) => {
        setIsUpdating(true)
        if (isUpdating) {
            return
        }
        const newTag = newTags?.find(
            (newTag) => !tagsArray.find((tag) => tag.label === newTag)
        )
        const existingTags = tagsArray.filter((tag) =>
            newTags?.includes(tag.label)
        )
        if (!newTag) {
            // no new tag was added.
            const updatedStory = await updateUserstory(id, {
                tags: existingTags.map((tag) => [tag.label, tag.color]),
                version: data.version,
            })
            setSelected(newTags)
            queryCache.setQueryData(['userstory', { id }], () => updatedStory)
        } else {
            queryCache.setQueryData(
                ['tags', { projectId }],
                (prevData: TagObject) => ({ ...prevData, [newTag]: '' })
            )
            const updatedStory = await updateUserstory(id, {
                tags: [
                    ...existingTags.map((tag) => [tag.label, tag.color]),
                    [newTag, ''],
                ],
                version: data.version,
            })
            setSelected(newTags)
            queryCache.setQueryData(['userstory', { id }], () => updatedStory)
            // new tag was added
        }
        setIsUpdating(false)
    }
    return (
        <StyledTagPicker
            mode="tags"
            value={selected}
            disabled={isUpdating}
            tagRender={({ label }) => {
                return <Tag>{label}</Tag>
            }}
            onChange={handleChange}
            options={tagsArray}
        />
    )
}

export default CustomTagPicker
