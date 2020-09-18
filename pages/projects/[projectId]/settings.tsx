import { useRouter } from 'next/router'
import { useState } from 'react'
import { useQuery } from 'react-query'
import styled from 'styled-components'
import Flex from '../../../components/Flex'
import { PageBody, PageHeader } from '../../../components/Layout'
import PageTitle from '../../../components/PageTitle'
import ProjectSettings from '../../../components/project-settings/ProjectSettings'
import { getProject } from '../../../taiga-api/projects'

const Menu = styled.nav`
    display: flex;
    flex-direction: column;
    margin: 20px 0px;
    width: 300px;
`

const MenuItem = styled.button<{ active?: boolean }>`
    border: none;
    text-align: left;
    background: none;
    color: #555;
    font-weight: ${({ active }) => (active ? 'bold' : 'normal')};
    padding: 10px;
    &:hover {
        color: #333;
    }
`

const Content = styled.div`
    margin: 20px 20px;
    margin-left: 40px;
    min-width: 500px;
`

const StyledFlex = styled(Flex)`
    width: min-content;
    margin: auto;
`

export default function Settings() {
    const { projectId } = useRouter().query
    const [tabIndex, setTabIndex] = useState(0)

    const { data: project } = useQuery(
        ['project', { projectId }],
        (key, { projectId }) => getProject(projectId as string),
        { enabled: projectId }
    )

    const handleTabClick = (index: number) => () => setTabIndex(index)

    const tabs = [
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
                <PageTitle
                    title="Settings"
                    description={`For Project ${project?.name}`}
                />
            </PageHeader>
            <PageBody>
                <StyledFlex justify="flex-start">
                    <Menu>
                        {tabs.map((tab, index) => (
                            <MenuItem
                                onClick={handleTabClick(index)}
                                key={index}
                                active={index === tabIndex}
                            >
                                {tab}
                            </MenuItem>
                        ))}
                    </Menu>
                    <Content>{tabIndex === 0 && <ProjectSettings />}</Content>
                </StyledFlex>
            </PageBody>
        </div>
    )
}
