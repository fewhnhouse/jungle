import { Breadcrumb } from 'rsuite'
import styled from 'styled-components'
import { UserStory } from '../../api/userstories'
import { WrappedLink } from '../header/Header'

const StyledBreadcrumb = styled(Breadcrumb)`
    margin: 0px;
`
const Separator = styled.span`
    font-size: 16px;
`

interface Props {
    data: UserStory
}

const Breadcrumbs = ({ data }: Props) => {
    return (
        <StyledBreadcrumb separator={<Separator>/</Separator>}>
            <Breadcrumb.Item>
                <WrappedLink
                    href="/projects/[projectId]"
                    as={`/projects/${data.project}`}
                >
                    {data.project_extra_info.name}
                </WrappedLink>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
                <WrappedLink
                    href="/projects/stories/[id]"
                    as={`/projects/stories/${data.id}`}
                >
                    {data.subject}
                </WrappedLink>
            </Breadcrumb.Item>
        </StyledBreadcrumb>
    )
}

export default Breadcrumbs
