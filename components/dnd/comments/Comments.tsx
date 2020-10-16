import { Button, Divider, Input, Skeleton } from 'antd'
import { useState } from 'react'
import { queryCache, useQuery } from 'react-query'
import styled from 'styled-components'
import {
    getTaskHistory,
    getUserstoryHistory,
    TaigaHistory,
} from '../../../taiga-api/history'
import { updateTask } from '../../../taiga-api/tasks'
import { updateUserstory } from '../../../taiga-api/userstories'
import Flex from '../../Flex'
import Comment from './Comment'

const CommentBox = styled(Flex)`
    max-height: 200px;
    overflow: auto;
`

const InputContainer = styled.form`
    width: 100%;
    display: flex;
    margin-top: 10px;
`

const Comments = ({
    id,
    type,
    version,
}: {
    id: number
    type: 'userstory' | 'task'
    version?: number
}) => {
    const [text, setText] = useState('')

    const { data, isLoading } = useQuery(
        ['comments', { id, type }],
        async (key, { id, type }) => {
            return type === 'userstory'
                ? await getUserstoryHistory(id, 'comment')
                : await getTaskHistory(id, 'comment')
        }
    )

    const addComment = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const userString = localStorage.getItem('user')
        const user = JSON.parse(userString)
        setText('')
        queryCache.setQueryData(
            ['comments', { id, type }],
            (prevData: TaigaHistory[]) => [
                ...prevData,
                {
                    comment: text,
                    user,
                    created_at: new Date().toISOString(),
                },
            ]
        )
        if (type === 'userstory') {
            await updateUserstory(id, { comment: text, version })
        } else {
            await updateTask(id, { comment: text, version })
        }
        queryCache.invalidateQueries(['comments', { id, type }])
    }

    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) =>
        setText(e.target.value)

    return (
        <Flex fluid direction="column">
            <Divider />
            <CommentBox fluid direction="column">
                {isLoading && <Skeleton active paragraph={{ rows: 5 }} />}
                <Flex direction="column" style={{ width: '100%' }}>
                    {data?.map((comment) => {
                        return (
                            <Comment
                                id={id}
                                type={type}
                                key={comment.id}
                                comment={comment}
                            />
                        )
                    })}
                </Flex>
            </CommentBox>
            <InputContainer onSubmit={addComment}>
                <Input
                    placeholder="Type a comment..."
                    value={text}
                    onChange={handleTextChange}
                    style={{ flex: 1, marginRight: 5 }}
                />
                <Button htmlType="submit" type="primary">
                    &uarr;
                </Button>
            </InputContainer>
        </Flex>
    )
}
export default Comments
