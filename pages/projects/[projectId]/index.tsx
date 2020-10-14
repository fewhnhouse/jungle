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
import { Avatar, Button } from 'antd'
import { EyeOutlined, LikeOutlined } from '@ant-design/icons'

const StyledFlex = styled(Flex)`
    margin-top: 20px;
`

const Container = styled.div`
    &:first-child {
        margin-right: 10px;
    }
    &:last-child {
        margin-left: 10px;
    }
`

const StyledButton = styled(Button)`
    &:first-child {
        margin-left: 0px;
    }
    margin: 0px 2.5px;
    &:last-child {
        margin-right: 0px;
    }
`

const StyledAvatar = styled(Avatar)`
    margin: 0px 10px;
    &:first-child {
        margin: 0px;
    }
    box-sizing: border-box;
    transition: 0.2s all ease-in-out;
    cursor: pointer;
    &:hover {
        box-shadow: 0px 0px 2px 1px rgba(0, 0, 0, 0.3);
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
                        <StyledButton icon={<LikeOutlined />}>
                            Like
                        </StyledButton>
                        <Link
                            href="/projects/[id]/board"
                            as={`/projects/${projectId}/board`}
                        >
                            <StyledButton icon={<LikeOutlined />}>
                                Board
                            </StyledButton>
                        </Link>
                        <Link
                            href="/projects/[id]/board"
                            as={`/projects/${projectId}/board`}
                        >
                            <StyledButton icon={<LikeOutlined />}>
                                Backlog
                            </StyledButton>
                        </Link>
                    </StyledFlex>
                    <StyledFlex>
                        {data.members.map((member) => (
                            <StyledAvatar
                                size="large"
                                key={member.id}
                                src={member.photo}
                            >
                                {member.full_name
                                    .split(' ')
                                    .reduce(
                                        (prev, curr) => prev + curr.charAt(0),
                                        ''
                                    )}
                            </StyledAvatar>
                        ))}
                    </StyledFlex>
                </>
            </PageHeader>
            <PageBody>
                <Flex>
                    <Container>
                        <h2>Activity</h2>
                        {timeline?.map((item) => (
                            <ActivityListItem
                                key={item.id}
                                activityItem={item}
                            />
                        ))}
                    </Container>
                    <Container>
                        <h2>Recent Tasks</h2>
                    </Container>
                </Flex>
            </PageBody>
        </>
    )
}

export default Project
