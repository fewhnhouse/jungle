import { UploadOutlined } from '@ant-design/icons'
import { message, Upload } from 'antd'
import { useEffect, useState } from 'react'
import styled from 'styled-components'
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

const Uploader = ({ data }) => {
    const [token, setToken] = useState('')
    useEffect(() => {
        const token = localStorage?.getItem('auth-token')
        setToken(token)
    }, [])

    const onChange = (info) => {
        const { status } = info.file
        if (status !== 'uploading') {
            console.log(info.file, info.fileList)
        }
        if (status === 'done') {
            message.success(`${info.file.name} file uploaded successfully.`)
        } else if (status === 'error') {
            message.error(`${info.file.name} file upload failed.`)
        }
    }
    return (
        <UploadSection>
            <Upload.Dragger
                data={{
                    object_id: data.id,
                    project: data.project,
                }}
                multiple
                name="attached_file"
                headers={{
                    Authorization: token && `Bearer ${token}`,
                }}
                action={`${process.env.NEXT_PUBLIC_TAIGA_API_URL}/tasks/attachments`}
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
