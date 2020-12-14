import { useRouter } from 'next/router'
import { useState } from 'react'
import { useQuery } from 'react-query'
import { PageBody, PageHeader } from '../../../components/Layout'
import PageTitle from '../../../components/PageTitle'
import ProjectDetails from '../../..../../../components/project-settings/ProjectDetails'
import Settings from '../../../components/Settings'
import { getProject } from '../../../taiga-api/projects'
import styled from 'styled-components'
import Head from 'next/head'
import Statuses from '../../../components/project-settings/statuses/'
import DefaultValues from '../../../components/project-settings/defaultValues'
import Members from '../../../components/project-settings/members'
import Points from '../../../components/project-settings/points'
import Tags from '../../../components/project-settings/tags'
import useMedia from 'use-media'
import { Button, Result, Skeleton } from 'antd'
import Flex from '../../../components/Flex'
import CustomFields from '../../../components/project-settings/customFields'
import { getMe } from '../../../taiga-api/users'

const HeaderContainer = styled.div`
    margin: auto;
    max-width: 840px;
`

export default function ProjectSettings() {
    const { back, query } = useRouter()
    const { projectId } = query
    const [menuItemIndex, setMenuItemIndex] = useState(0)
    const isMobile = useMedia('(max-width: 900px)')
    const { data: project, isLoading: isProjectLoading } = useQuery(
        ['project', { projectId }],
        (key, { projectId }) => getProject(projectId as string),
        { enabled: projectId }
    )
    const { data: me, isLoading: isMeLoading } = useQuery('me', () => getMe())

    const handleItemClick = (index: number) => () => setMenuItemIndex(index)

    const menuItems = [
        'Project Details',
        'Default Values',
        'Statuses',
        'Points',
        'Custom Fields',
        'Tags',
        'Members',
        // 'Permissions',
        // 'Integrations',
    ]

    const isLoading = isMeLoading || isProjectLoading

    const hasAccess = project?.members.find((m) => m.id === me?.id)

    return (
        <div>
            <Head>
                <title>Settings: {project?.name}</title>
                <meta
                    name="viewport"
                    content="initial-scale=1.0, width=device-width"
                />
            </Head>

            <PageHeader>
                <HeaderContainer>
                    <PageTitle
                        title="Settings"
                        description={`For Project ${project?.name}`}
                    />
                </HeaderContainer>
            </PageHeader>
            <PageBody>
                <Skeleton loading={isLoading}>
                    {hasAccess ? (
                        <>
                            {isMobile ? (
                                <Flex fluid align="center" justify="center">
                                    <Result
                                        title="Settings are not supported on small screens yet."
                                        status="warning"
                                    />
                                </Flex>
                            ) : (
                                <Settings
                                    onMenuItemClick={handleItemClick}
                                    menuItems={menuItems}
                                    menuIndex={menuItemIndex}
                                >
                                    {menuItemIndex === 0 && <ProjectDetails />}
                                    {menuItemIndex === 1 && <DefaultValues />}
                                    {menuItemIndex === 2 && <Statuses />}
                                    {menuItemIndex === 3 && <Points />}
                                    {menuItemIndex === 4 && <CustomFields />}
                                    {menuItemIndex === 5 && <Tags />}
                                    {menuItemIndex === 6 && <Members />}
                                </Settings>
                            )}
                        </>
                    ) : (
                        <Flex
                            fluid
                            justify="center"
                            align="center"
                        >
                            <Result
                                title="You do not have access to view this page."
                                status="403"
                                extra={
                                    <Button onClick={back} type="primary">
                                        Go Back
                                    </Button>
                                }
                            />
                        </Flex>
                    )}
                </Skeleton>
            </PageBody>
        </div>
    )
}
