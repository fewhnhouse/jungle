import { Button } from 'antd'
import Image from 'next/image'
import Link from 'next/link'
import styled from 'styled-components'
import { User } from '../taiga-api/users'
import { getNameInitials } from '../util/getNameInitials'

const StyledButton = styled(Button)`
    margin: 0px 5px;
    width: 32px;
    height: 32px;
    &:first-child {
        margin-left: 0px;
    }
    &:last-child {
        margin-right: 0px;
    }
`

export default function MemberButton({ member }: { member: User }) {
    return (
        <Link passHref href={`/users/${member.id}`} key={member.id}>
            <StyledButton
                type="primary"
                shape="circle"
            >
                {member?.photo && (
                    <Image src={member.photo} width={30} height={30} />
                )}
                {!member?.photo && getNameInitials(member.full_name)}
            </StyledButton>
        </Link>
    )
}
