import styled from 'styled-components'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { PageBody, PageHeader } from '../../../components/Layout'
import PageTitle from '../../../components/PageTitle'
import { useQuery } from 'react-query'
import { getProject } from '../../../taiga-api/projects'
import { getProjectTimeline } from '../../../taiga-api/timelines'
import ActivityListItem from '../../../components/home/ActivityListItem'
import Flex from '../../../components/Flex'
import { Button } from 'antd'
import { EyeOutlined, LikeOutlined } from '@ant-design/icons'

const StyledFlex = styled(Flex)`
    margin-top: 20px;
`

const StyledButton = styled(Button)`
    &:first-child {
        margin-right: 5px;
    }
    &:last-child {
        margin-left: 5px;
    }
`
const Project = () => {
    const router = useRouter()
    const { projectId } = router.query

    const { data } = useQuery(
        ['project', { projectId }],
        (key, { projectId }) => getProject(projectId as string)
    )

    const { data: timeline } = useQuery(
        ['projectTimeline', { projectId }],
        (key, { projectId }) => getProjectTimeline(projectId)
    )

    return (
        <>
            <PageHeader>
                <>
                    <PageTitle
                        title={data?.name}
                        description={data?.description}
                    />
                    <StyledFlex>
                        <StyledButton icon={<EyeOutlined />}>
                            Watch
                        </StyledButton>
                        <StyledButton icon={<LikeOutlined />}>Like</StyledButton>
                    </StyledFlex>
                </>
            </PageHeader>
            <PageBody>
                <Flex>
                    <div>
                        {timeline?.map((item) => (
                            <ActivityListItem
                                key={item.id}
                                activityItem={item}
                            />
                        ))}
                    </div>
                    <div>
                        <Link
                            href="/projects/[id]/board"
                            as={`/projects/${projectId}/board`}
                        >
                            <a>Board</a>
                        </Link>
                        <Link
                            href="/projects/[id]/backlog"
                            as={`/projects/${projectId}/backlog`}
                        >
                            <a>Backlog</a>
                        </Link>
                    </div>
                </Flex>
            </PageBody>
        </>
    )
}

export default Project
