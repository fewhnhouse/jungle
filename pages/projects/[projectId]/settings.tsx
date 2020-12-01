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

const HeaderContainer = styled.div`
    margin: auto;
    max-width: 840px;
`

export default function ProjectSettings() {
    const { projectId } = useRouter().query
    const [menuItemIndex, setMenuItemIndex] = useState(0)

    const { data: project } = useQuery(
        ['project', { projectId }],
        (key, { projectId }) => getProject(projectId as string),
        { enabled: projectId }
    )

    const handleItemClick = (index: number) => () => setMenuItemIndex(index)

    const menuItems = [
        'Project Details',
        'Statuses',
        'Default Values',
        'Attributes',
        'Members',
        'Permissions',
        'Integrations',
    ]
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
                <Settings
                    onMenuItemClick={handleItemClick}
                    menuItems={menuItems}
                    menuIndex={menuItemIndex}
                >
                    {menuItemIndex === 0 && <ProjectDetails />}
                    {menuItemIndex === 1 && <Statuses />}
                    {menuItemIndex === 2 && <DefaultValues />}
                </Settings>
            </PageBody>
        </div>
    )
}
