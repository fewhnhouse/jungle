import { Form, Input } from 'antd'
import {
    TaskStatus,
    updateTaskStatus,
} from '../../taiga-api/tasks'

interface EditableCellProps {
    title: React.ReactNode
    dataIndex: string
    record: TaskStatus
}

const EditableInputCell: React.FC<EditableCellProps> = ({
    title,
    dataIndex,
    record,
    ...restProps
}) => {
    const [form] = Form.useForm()

    const handleSave = async () => {
        try {
            const values = await form.validateFields()

            await updateTaskStatus(record.id, {
                [dataIndex]: values[dataIndex],
            })
        } catch (errInfo) {
            console.log('Save failed:', errInfo)
        }
    }

    return (
        <td {...restProps}>
            <Form
                form={form}
                onFinish={handleSave}
                initialValues={{ [dataIndex]: record[dataIndex] }}
            >
                <Form.Item
                    style={{ margin: 0 }}
                    name={dataIndex}
                    rules={[
                        {
                            required: true,
                            message: `${title} is required.`,
                        },
                    ]}
                >
                    <Input
                        onPressEnter={handleSave}
                        onBlur={handleSave}
                        bordered={false}
                    />
                </Form.Item>
            </Form>
        </td>
    )
}

export default EditableInputCell