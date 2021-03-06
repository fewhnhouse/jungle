import { SendOutlined } from '@ant-design/icons'
import { Avatar, Button, Form, Mentions, Skeleton } from 'antd'
import { useRouter } from 'next/router'
import { useQueryCache, useQuery } from 'react-query'
import styled from 'styled-components'
import useMedia from 'use-media'
import {
    getTaskHistory,
    getUserstoryHistory,
    TaigaHistory,
} from '../../../taiga-api/history'
import { getProject } from '../../../taiga-api/projects'
import { Task, updateTask } from '../../../taiga-api/tasks'
import { updateUserstory, UserStory } from '../../../taiga-api/userstories'
import Flex from '../../Flex'
import Comment from './Comment'

const CommentBox = styled(Flex)`
    @media (min-width: 700px) {
        max-height: 200px;
        overflow: auto;
    }
`

const InputContainer = styled(Form)<{ $hasComments?: boolean }>`
    width: 100%;
    display: flex;
    margin-top: ${({ $hasComments }) => ($hasComments ? '10px' : '0px')};
`

const FullName = styled.span`
    color: grey;
    font-size: 12px;
`

const ProfilePic = styled(Avatar)`
    margin-right: 5px;
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
    const queryCache = useQueryCache()
    const isMobile = useMedia('(max-width: 700px)')

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
            (prevData: TaigaHistory[] = []) => [
                ...prevData,
                {
                    comment,
                    user,
                    created_at: new Date().toISOString(),
                },
            ]
        )
        if (type === 'userstory') {
            const updatedStory = await updateUserstory(id, { comment, version })
            queryCache.setQueryData(
                ['userstories', { projectId }],
                (prevData: UserStory[]) =>
                    prevData?.map((story) =>
                        story.id === updatedStory.id ? updatedStory : story
                    )
            )
        } else {
            const updatedTask = await updateTask(id, { comment, version })
            queryCache.setQueryData(
                ['tasks', { projectId }],
                (prevData: Task[]) =>
                    prevData?.map((task) =>
                        task.id === updatedTask.id ? updatedTask : task
                    )
            )
        }
        queryCache.invalidateQueries(['comments', { id, type }])
    }

    return (
        <Flex fluid direction="column">
            <CommentBox fluid direction="column">
                {isLoading && <Skeleton active paragraph={{ rows: 5 }} />}
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
            </CommentBox>
            <InputContainer
                $hasComments={data?.length !== 0}
                form={form}
                layout="inline"
                onFinish={addComment}
            >
                <Form.Item name="comment" style={{ flex: 1 }}>
                    <Mentions
                        rows={2}
                        loading={isProjectLoading}
                        placeholder="Type a comment..."
                        style={{
                            flex: 1,
                            marginRight: 10,
                            fontSize: isMobile ? 16 : 14,
                        }}
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
                    size={isMobile ? 'large' : 'middle'}
                    icon={<SendOutlined />}
                    htmlType="submit"
                    type="primary"
                ></Button>
            </InputContainer>
        </Flex>
    )
}
export default Comments
