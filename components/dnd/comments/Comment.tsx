import {
    Avatar,
    Button,
    Tooltip,
    Menu,
    Dropdown,
    Input,
    Typography,
} from 'antd'
import styled, { css } from 'styled-components'
import {
    deleteTaskComment,
    deleteUserstoryComment,
    TaigaHistory,
    undeleteTaskComment,
    undeleteUserstoryComment,
} from '../../../taiga-api/history'
import { getActivityDate } from '../../../util/getActivityDate'
import { getNameInitials } from '../../../util/getNameInitials'
import Flex from '../../Flex'
import {
    DeleteOutlined,
    EditOutlined,
    EllipsisOutlined,
    RetweetOutlined,
} from '@ant-design/icons'
import { useState } from 'react'
import { queryCache } from 'react-query'

const StyledAvatar = styled(Avatar)`
    min-width: 30px;
    min-height: 30px;
`

const textStyle = css`
    white-space: pre-wrap;
    margin: 0px 10px;
    text-align: left;
    flex: 1;
`

const Text = styled.span`
    ${textStyle}
`

const DisabledText = styled(Typography.Text)`
    ${textStyle}
`

const CommentContainer = styled(Flex)`
    width: 100%;
    border-bottom: 1px solid rgba(0, 0, 0, 0.06);
    padding: 10px 0px;
    &:last-child {
        border-bottom: unset;
    }
`

const DateText = styled.span`
    margin-right: 5px;
`

const Comment = ({
    id,
    comment,
    type,
}: {
    id: number
    comment: TaigaHistory
    type: 'task' | 'userstory'
}) => {
    const [edit, setEdit] = useState(false)
    const date = new Date(comment.edit_comment_date ?? comment.created_at)
    const handleDelete = async () => {
        queryCache.setQueryData(
            ['comments', { id, type }],
            (comments: TaigaHistory[]) =>
                comments.filter((c) => comment.id !== c.id)
        )
        if (type === 'task') {
            await deleteTaskComment(id, comment.id)
        } else {
            await deleteUserstoryComment(id, comment.id)
        }
    }

    const handleRestore = async () => {
        if (type === 'task') {
            await undeleteTaskComment(id, comment.id)
            queryCache.invalidateQueries(['comments', { id, type }])
        } else {
            await undeleteUserstoryComment(id, comment.id)
            queryCache.invalidateQueries(['comments', { id, type }])
        }
    }

    const menu = (
        <Menu>
            {comment.delete_comment_user ? (
                <Menu.Item key="1" onClick={handleRestore}>
                    <RetweetOutlined /> Restore
                </Menu.Item>
            ) : (
                <>
                    <Menu.Item key="0" onClick={() => setEdit((edit) => !edit)}>
                        <EditOutlined />
                        Edit
                    </Menu.Item>
                    <Menu.Item key="1" onClick={handleDelete}>
                        <DeleteOutlined />
                        Delete
                    </Menu.Item>
                </>
            )}
        </Menu>
    )

    return (
        <CommentContainer justify="space-between" align="center">
            <StyledAvatar src={comment.user.photo}>
                {getNameInitials(comment.user.name)}
            </StyledAvatar>
            {comment.delete_comment_user ? (
                <DisabledText disabled>
                    {`Comment deleted by ${comment.delete_comment_user.name}`}{' '}
                </DisabledText>
            ) : edit ? (
                <Input />
            ) : (
                <Text>{comment.comment}</Text>
            )}
            <Tooltip
                title={`${date.toLocaleDateString()}, ${date.toLocaleTimeString()}`}
            >
                <DateText>{getActivityDate(date)}</DateText>
            </Tooltip>
            <Dropdown overlay={menu} trigger={['click']}>
                <Button type="text" icon={<EllipsisOutlined />}></Button>
            </Dropdown>
        </CommentContainer>
    )
}

export default Comment
