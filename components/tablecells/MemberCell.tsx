import { CrownOutlined } from '@ant-design/icons'
import { Avatar, Tooltip } from 'antd'
import styled from 'styled-components'
import Flex from '../Flex'

const StyledAvatar = styled(Avatar)`
    margin-right: 5px;
`

interface SwitchCellProps {
    record: { [key: string]: unknown }
    avatarIndex: string
    usernameIndex: string
    fullnameIndex: string
    emailIndex: string
}

const MemberCell: React.FC<SwitchCellProps> = ({
    record,
    avatarIndex,
    usernameIndex,
    fullnameIndex,
    emailIndex,
    ...restProps
}) => {
    return (
        <td {...restProps}>
            <Flex align="center">
                <StyledAvatar src={record[avatarIndex]}>
                    {(
                        (record[fullnameIndex] as string) ??
                        (record[usernameIndex] as string)
                    )
                        ?.split(' ')
                        ?.reduce((prev, curr) => prev + curr.charAt(0), '')}
                </StyledAvatar>
                <Flex direction="column">
                    <span>
                        {record[usernameIndex] ?? record[fullnameIndex]}{' '}
                        {record.is_owner && (
                            <Tooltip title="Owner">
                                <CrownOutlined />
                            </Tooltip>
                        )}
                    </span>
                    <span>{record[emailIndex]}</span>
                </Flex>
            </Flex>
        </td>
    )
}

export default MemberCell
