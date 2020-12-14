import { Button, Result } from 'antd'
import { useRouter } from 'next/router'
import Flex from '../../components/Flex'

const Terms = () => {
    const { back } = useRouter()
    return (
        <Flex style={{ height: '100vh' }} fluid justify="center" align="center">
            <Result
                title={
                    <span>
                        This tool is still in prototype status and terms and
                        conditions are not relevant for usage yet.
                        <br /> Data stored in the tool is deleted periodically
                        and is not shared with anyone.
                    </span>
                }
                extra={
                    <Button onClick={back} type="primary">
                        Go Back
                    </Button>
                }
            />
        </Flex>
    )
}

export default Terms
