import { Form, Input } from 'antd'

interface EditableCellProps {
    title: React.ReactNode
    dataIndex: string
    record: { [key: string]: unknown }
    type?: string
    handleSave: (
        record: any,
        dataIndex: string,
        value: any
    ) => void
}

const EditableInputCell: React.FC<EditableCellProps> = ({
    title,
    dataIndex,
    record,
    type,
    handleSave,
    ...restProps
}) => {
    const [form] = Form.useForm()

    const onSave = async () => {
        try {
            const values = await form.validateFields()
            handleSave(record, dataIndex, values[dataIndex])
        } catch (errInfo) {
            console.log('Save failed:', errInfo)
        }
    }

    return (
        <td {...restProps}>
            <Form
                form={form}
                onFinish={onSave}
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
                        type={type}
                        onPressEnter={onSave}
                        onBlur={onSave}
                        bordered={false}
                    />
                </Form.Item>
            </Form>
        </td>
    )
}

export default EditableInputCell
