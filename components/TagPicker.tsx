import { useRouter } from 'next/router'
import { useState } from 'react'
import { queryCache, useQuery } from 'react-query'
import { Tag, TagPicker } from 'rsuite'
import styled from 'styled-components'
import { getTagColors, TagObject } from '../taiga-api/projects'
import { getUserstory, updateUserstory } from '../taiga-api/userstories'

const StyledTagPicker = styled(TagPicker)`
    width: 100%;
`

const ColoredTag = styled(Tag)<{ backgroundColor?: string }>`
    background-color: ${({ backgroundColor }) => backgroundColor};
    font-weight: bold;
`
interface Props {
    id: number
}
const CustomTagPicker = ({ id }: Props) => {
    const { data: userStory } = useQuery(
        ['story', { id }],
        (key, { id }) => getUserstory(id),
        { enabled: open }
    )

    const mappedSelectedTags = userStory?.tags?.map((tag) => tag[0]) ?? []
    const [selected, setSelected] = useState(mappedSelectedTags)
    const [isUpdating, setIsUpdating] = useState(false)
    const { projectId } = useRouter().query
    const { data: tags } = useQuery(
        ['tags', { projectId }],
        (key, { projectId }) => getTagColors(projectId as string)
    )
    const tagsArray = tags
        ? Object.keys(tags).map((key) => ({
              label: key,
              value: key,
              color: tags[key],
          }))
        : []

    const handleChange = async (newTags?: string[], event) => {
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
                version: userStory.version,
            })
            setSelected(newTags)
            queryCache.setQueryData(['story', { id }], () => updatedStory)
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
                version: userStory.version,
            })
            setSelected(newTags)
            queryCache.setQueryData(['story', { id }], () => updatedStory)
            // new tag was added
        }
        setIsUpdating(false)
    }
    return (
        <StyledTagPicker
            creatable
            value={selected}
            disabled={isUpdating}
            renderValue={(values, items) => {
                return items.map((tag, index) => (
                    <ColoredTag backgroundColor={tag?.color} key={index}>
                        {tag?.label}
                    </ColoredTag>
                ))
            }}
            onChange={handleChange}
            renderMenuItem={(label, item) => {
                return (
                    <ColoredTag backgroundColor={item?.color}>
                        {label}
                    </ColoredTag>
                )
            }}
            data={tagsArray}
        />
    )
}

export default CustomTagPicker
