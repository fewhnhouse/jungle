import { Button } from 'antd'
import Image from 'next/image'
import Link from 'next/link'
import styled from 'styled-components'
import { Member } from '../taiga-api/projects'
import { getNameInitials } from '../util/getNameInitials'

const StyledButton = styled(Button)`
    margin: 0px 5px;
    width: 32px;
    padding: 0;
    height: 32px;
    img {
        border-radius: 50% !important;
    }
    transition: box-shadow 0.2s ease-in-out;
    &:first-child {
        margin-left: 0px;
    }
    &:last-child {
        margin-right: 0px;
    }
    &:hover {
        box-shadow: 0px 0px 2px 1px rgba(0, 0, 0, 0.3);
    }
`

export default function MemberButton({ member }: { member: Member }) {
    return (
        <Link passHref href={`/users/${member.id}`} key={member.id}>
            <StyledButton type="primary" shape="circle">
                {member?.photo && (
                    <Image
                        alt={member.full_name}
                        src={member.photo}
                        width={30}
                        height={30}
                    />
                )}
                {!member?.photo && getNameInitials(member.full_name)}
            </StyledButton>
        </Link>
    )
}
