import { Breadcrumb } from 'rsuite'
import styled from 'styled-components'
import { Task } from '../../api/tasks'
import { WrappedLink } from '../header/Header'

const StyledBreadcrumb = styled(Breadcrumb)`
    margin: 0px;
`
const Separator = styled.span`
    font-size: 16px;
`

interface Props {
    data: Task
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
                    href="/projects/[projectId]/stories/[id]"
                    as={`/projects/${data.project}/stories/${data.user_story}`}
                >
                    {data.user_story_extra_info.subject}
                </WrappedLink>
            </Breadcrumb.Item>
            <Breadcrumb.Item active>
                <WrappedLink
                    href="/projects/[projectId]/tasks/[id]"
                    as={`/projects/${data.project}/tasks/${data.id}`}
                >
                    {data.subject}
                </WrappedLink>
            </Breadcrumb.Item>
        </StyledBreadcrumb>
    )
}

export default Breadcrumbs
