import { Breadcrumb } from 'antd'
import Link from 'next/link'
import styled from 'styled-components'
import { UserStory } from '../taiga-api/userstories'

const StyledBreadcrumb = styled(Breadcrumb)`
    margin: 0px;
`

interface Props {
    data: UserStory
}

const Breadcrumbs = ({ data }: Props) => {
    return (
        <StyledBreadcrumb>
            <Breadcrumb.Item>
                <Link href={`/projects/${data.project}`}>
                    <a>{data.project_extra_info.name}</a>
                </Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
                <Link href={`/projects/${data.project}/stories/${data.id}`}>
                    <a>{data.subject}</a>
                </Link>
            </Breadcrumb.Item>
        </StyledBreadcrumb>
    )
}

export default Breadcrumbs
