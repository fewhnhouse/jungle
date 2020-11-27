import { SendOutlined } from '@ant-design/icons'
import { Avatar, Button, Form, Mentions, Skeleton } from 'antd'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { queryCache, useQuery } from 'react-query'
import styled from 'styled-components'
import {
    getTaskHistory,
    getUserstoryHistory,
    TaigaHistory,
} from '../../../taiga-api/history'
import { getProject } from '../../../taiga-api/projects'
import { updateTask } from '../../../taiga-api/tasks'
import { updateUserstory } from '../../../taiga-api/userstories'
import Flex from '../../Flex'
import Comment from './Comment'

const CommentBox = styled(Flex)`
    max-height: 200px;
    overflow: auto;
`

const InputContainer = styled(Form)`
    width: 100%;
    display: flex;
    margin-top: 10px;
`

const FullName = styled.span`
    color: grey;
    font-size: 12px;
`

const ProfilePic = styled(Avatar)`
    margin-right: 5px;
`

const CommentContainer = styled(Flex)`
    width: 100%;
    max-height: 200px;
    overflow: auto;
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
    const [form] = Form.useForm()
    const { projectId } = useRouter().query

    const { data: project, isLoading: isProjectLoading } = useQuery(
        ['project', { projectId }],
        async (key, { projectId }) => {
            return getProject(projectId)
        }
    )

    const { data, isLoading } = useQuery(
        ['comments', { id, type }],
        async (key, { id, type }) => {
            return type === 'userstory'
                ? await getUserstoryHistory(id, 'comment')
                : await getTaskHistory(id, 'comment')
        }
    )

    const addComment = async ({ comment }: { comment: string }) => {
        const userString = localStorage.getItem('user')
        const user = JSON.parse(userString)
        form.resetFields()
        queryCache.setQueryData(
            ['comments', { id, type }],
            (prevData: TaigaHistory[]) => [
                ...prevData,
                {
                    comment,
                    user,
                    created_at: new Date().toISOString(),
                },
            ]
        )
        if (type === 'userstory') {
            await updateUserstory(id, { comment, version })
        } else {
            await updateTask(id, { comment, version })
        }
        queryCache.invalidateQueries(['comments', { id, type }])
    }

    return (
        <Flex fluid direction="column">
            <CommentBox fluid direction="column">
                {isLoading && <Skeleton active paragraph={{ rows: 5 }} />}
                <CommentContainer direction="column">
                    {data
                        ?.sort(
                            (a, b) =>
                                new Date(a.created_at).getTime() -
                                new Date(b.created_at).getTime()
                        )
                        .map((comment) => {
                            return (
                                <Comment
                                    id={id}
                                    type={type}
                                    key={comment.id}
                                    comment={comment}
                                />
                            )
                        })}
                </CommentContainer>
            </CommentBox>
            <InputContainer form={form} layout="inline" onFinish={addComment}>
                <Form.Item name="comment" style={{ flex: 1 }}>
                    <Mentions
                        rows={2}
                        loading={isProjectLoading}
                        placeholder="Type a comment..."
                        style={{ flex: 1, marginRight: 10 }}
                    >
                        {project?.members?.map((member) => (
                            <Mentions.Option
                                key={member.id.toString()}
                                value={member.username}
                            >
                                <Flex align="center">
                                    <ProfilePic src={member.photo}>
                                        {member.full_name
                                            .split(' ')
                                            .map((i) => i.charAt(0))}
                                    </ProfilePic>
                                    <Flex direction="column" align="flex-start">
                                        <span>{member.username}</span>
                                        {member.full_name && (
                                            <FullName>
                                                {member.full_name}
                                            </FullName>
                                        )}
                                    </Flex>
                                </Flex>
                            </Mentions.Option>
                        ))}
                    </Mentions>
                </Form.Item>
                <Button
                    icon={<SendOutlined />}
                    htmlType="submit"
                    type="primary"
                ></Button>
            </InputContainer>
        </Flex>
    )
}
export default Comments
