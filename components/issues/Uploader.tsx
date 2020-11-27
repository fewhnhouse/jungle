import {
    DeleteOutlined,
    DownloadOutlined,
    FileOutlined,
    UploadOutlined,
} from '@ant-design/icons'
import { Avatar, Button, List, message, Upload } from 'antd'
import { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import styled from 'styled-components'
import { deleteTaskAttachment, getTaskAttachments } from '../../taiga-api/tasks'
import {
    deleteUserstoryAttachment,
    getUserstoryAttachments,
} from '../../taiga-api/userstories'
import Flex from '../Flex'

const UploadSection = styled.div`
    width: 100%;
    & > span {
        width: 100%;
    }
`
const StyledFlex = styled(Flex)`
    span {
        &:first-child {
            margin-right: 5px;
        }
    }
`

interface Props {
    data: {
        project: number
        object_id: number
    }
    action: string
    type: 'task' | 'userstory'
}
const Uploader = ({ data, action, type }: Props) => {
    const [token, setToken] = useState('')
    const { data: files } = useQuery(
        ['attachments', { type, projectId: data.project, id: data.object_id }],
        (key, { type, projectId, id }) => {
            if (type === 'task') {
                return getTaskAttachments({ projectId, taskId: id })
            } else {
                return getUserstoryAttachments({ projectId, userstoryId: id })
            }
        }
    )
    const [attachments, setAttachments] = useState([])

    useEffect(() => {
        setAttachments(
            files?.map((att) => ({
                uid: att.id,
                name: att.name,
                status: 'done',
                url: att.url,
                thumbUrl: att.thumbnail_card_url,
            })) ?? []
        )
    }, [files])

    useEffect(() => {
        const token = localStorage?.getItem('auth-token')
        setToken(token)
    }, [])

    const onChange = ({ file, fileList }) => {
        const { status } = file
        if (status !== 'uploading') {
            console.log(file, fileList)
        }
        if (status === 'done') {
            message.success(`${file.name} file uploaded successfully.`)
        } else if (status === 'error') {
            message.error(`${file.name} file upload failed.`)
        }
        setAttachments(fileList)
    }

    const onPreview = async (file) => {
        let src = file.url
        if (!src) {
            src = await new Promise((resolve) => {
                const reader = new FileReader()
                reader.readAsDataURL(file.originFileObj)
                reader.onload = () => resolve(reader.result)
            })
        }
        const image = new Image()
        image.src = src
        const imgWindow = window.open(src)
        imgWindow.document.write(image.outerHTML)
    }

    const deleteAttachment = (uid: number) => async () => {
        if (type === 'task') await deleteTaskAttachment(uid)
        else if (type === 'userstory') await deleteUserstoryAttachment(uid)
        setAttachments((attachments) =>
            attachments.filter((a) => a.uid !== uid)
        )
    }

    return (
        <UploadSection>
            <Upload.Dragger
                data={data}
                multiple
                name="attached_file"
                headers={{
                    Authorization: token && `Bearer ${token}`,
                }}
                onPreview={onPreview}
                action={action}
                onChange={onChange}
            >
                <StyledFlex justify="center" align="center" fluid>
                    <UploadOutlined size={32} />
                    <p>Click or Drag files to upload</p>
                </StyledFlex>
            </Upload.Dragger>
            <Flex>
                <List style={{ width: '100%' }}>
                    {attachments.map((attachment) => (
                        <List.Item
                            key={attachment.uid}
                            actions={[
                                <a
                                    key="download"
                                    href={attachment.url}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    <Button
                                        icon={<DownloadOutlined />}
                                    ></Button>
                                </a>,
                                <Button
                                    danger
                                    onClick={deleteAttachment(attachment.uid)}
                                    key="delete"
                                    icon={<DeleteOutlined />}
                                ></Button>,
                            ]}
                        >
                            <List.Item.Meta
                                avatar={
                                    attachment.thumbUrl ? (
                                        <Avatar
                                            shape="square"
                                            src={attachment.thumbUrl}
                                        />
                                    ) : (
                                        <Avatar
                                            shape="square"
                                            icon={<FileOutlined />}
                                        />
                                    )
                                }
                                title={
                                    <a
                                        href={attachment.url}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        {attachment.name}
                                    </a>
                                }
                            />
                        </List.Item>
                    ))}
                </List>
            </Flex>
        </UploadSection>
    )
}

export default Uploader
