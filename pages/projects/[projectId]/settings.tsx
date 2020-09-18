import { useRouter } from 'next/router'
import { useState } from 'react'
import { useQuery } from 'react-query'
import { PageBody, PageHeader } from '../../../components/Layout'
import PageTitle from '../../../components/PageTitle'
import ProjectDetails from '../../..../../../components/project-settings/ProjectDetails'
import Settings from '../../../components/Settings'
import { getProject } from '../../../taiga-api/projects'
import styled from 'styled-components'

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
        'Modules',
        'Default Values',
        'Attributes',
        'Members',
        'Permissions',
        'Integrations',
    ]
    return (
        <div>
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
                </Settings>
            </PageBody>
        </div>
    )
}
