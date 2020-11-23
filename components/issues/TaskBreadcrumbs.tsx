import { Breadcrumb } from 'antd'
import Link from 'next/link'
import styled from 'styled-components'
import { Task } from '../../taiga-api/tasks'

const StyledBreadcrumb = styled(Breadcrumb)`
    margin: 0px;
`
const Separator = styled.span`
    font-size: 16px;
`

interface Props {
    data: Task
}

const TaskBreadcrumbs = ({ data }: Props) => {
    return (
        <StyledBreadcrumb separator={<Separator>/</Separator>}>
            <Breadcrumb.Item>
                <Link href={`/projects/${data.project}`}>
                    <a>{data.project_extra_info.name}</a>
                </Link>
            </Breadcrumb.Item>
            {data.user_story && (
                <Breadcrumb.Item>
                    <Link
                        href={`/projects/${data.project}/userstories/${data.user_story}`}
                    >
                        <a>{data.user_story_extra_info?.subject}</a>
                    </Link>
                </Breadcrumb.Item>
            )}
            <Breadcrumb.Item>
                <Link href={`/projects/${data.project}/tasks/${data.id}`}>
                    <a>{data.subject}</a>
                </Link>
            </Breadcrumb.Item>
        </StyledBreadcrumb>
    )
}

export default TaskBreadcrumbs
