import { Button, Card, Form, Select } from 'antd'
import styled from 'styled-components'

const StyledCard = styled(Card)`
    margin: 30px 0px;
    &:first-child {
        margin-top: 0px;
    }
    padding: 0px;
    max-width: 500px;
`

const Footer = styled.div`
    border-top: 1px solid #e5e5ea;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 20px;
    min-height: 60px;
    background: #fafafa;
`

const CardContent = styled.div`
    padding: 20px;
`

const StyledFormItem = styled(Form.Item)`
    padding: 20px;
`

const DefaultValueCard = ({
    title,
    submitText,
    initialValues,
    handleSubmit,
    description,
    name,
    options,
}) => {
    return (
        <StyledCard bodyStyle={{ padding: 0 }} title={title}>
            <Form
                initialValues={initialValues}
                layout="vertical"
                onFinish={handleSubmit}
            >
                <StyledFormItem name={name}>
                    <Select options={options} />
                </StyledFormItem>
                <Footer>
                    <span>{description}</span>
                    <Button htmlType="submit">{submitText ?? 'Save'}</Button>
                </Footer>
            </Form>
        </StyledCard>
    )
}

export default DefaultValueCard
