import { UploadOutlined } from '@ant-design/icons'
import { message, Upload } from 'antd'
import { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import styled from 'styled-components'
import { getTaskAttachments } from '../../taiga-api/tasks'
import { getUserstoryAttachments } from '../../taiga-api/userstories'
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
    const { data: initialAttachments } = useQuery(
        ['attachments', { type, projectId: data.project, id: data.object_id }],
        (key, { type, projectId, id }) => {
            if (type === 'task') {
                return getTaskAttachments({ projectId, taskId: id })
            } else {
                return getUserstoryAttachments({ projectId, userstoryId: id })
            }
        }
    )

    const [attachments, setAttachments] = useState(
        initialAttachments?.map((att) => ({
            uid: att.id,
            name: att.name,
            status: 'done',
            url: att.url,
            thumbUrl: att.thumbnail_card_url,
        })) ?? []
    )

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

    return (
        <UploadSection>
            <Upload.Dragger
                data={data}
                multiple
                name="attached_file"
                headers={{
                    Authorization: token && `Bearer ${token}`,
                }}
                fileList={attachments}
                listType="picture"
                onPreview={onPreview}
                action={action}
                onChange={onChange}
            >
                <StyledFlex justify="center" align="center" fluid>
                    <UploadOutlined size={32} />
                    <p>Click or Drag files to upload</p>
                </StyledFlex>
            </Upload.Dragger>
        </UploadSection>
    )
}

export default Uploader
