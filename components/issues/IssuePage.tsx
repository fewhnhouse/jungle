import React from 'react'
import styled from 'styled-components'
import { Divider } from 'antd'
import Flex from '../Flex'
import { ModalProps } from 'antd/lib/modal'
import { useRouter } from 'next/router'
import { Task } from '../../taiga-api/tasks'
import { UserStory } from '../../taiga-api/userstories'
import EditableDescription from './EditableDescription'
import EditableTitle from './EditableTitle'
import Comments from '../dnd/comments/Comments'

const Main = styled.div`
    display: flex;
    width: 100%;
    flex-direction: row;
    @media only screen and (max-width: 600px) {
        flex-direction: column;
    }
    overflow: auto;
    height: 100%;
`

const Content = styled(Flex)`
    flex: 3;
    margin-right: 10px;
`

const Sidebar = styled.aside`
    flex: 1;
    padding: ${({ theme }) => theme.spacing.small};
    display: flex;
    flex-direction: column;
    align-items: flex-start;
`

interface Props extends ModalProps {
    type: 'userstory' | 'task'
    innerContent?: React.ReactNode
    outerContent?: React.ReactNode
    sidebar?: React.ReactNode
    data: Task | UserStory
}

export default function IssuePage({
    type,
    innerContent,
    outerContent,
    sidebar,
    data,
}: Props) {
    const { id } = useRouter().query

    return (
        <Flex direction="column">
            <Main>
                <Content direction="column" justify="space-between">
                    <Flex style={{ width: '100%' }} align="center">
                        <EditableTitle
                            id={data?.id}
                            version={data?.version}
                            milestone={data?.milestone}
                            type={type}
                            initialValue={data?.subject}
                        />
                    </Flex>
                    <EditableDescription
                        id={data?.id}
                        version={data?.version}
                        milestone={data?.milestone}
                        type={type}
                        initialValue={data?.description}
                    />
                    {innerContent}
                </Content>
                <Sidebar>{sidebar}</Sidebar>
            </Main>
            <Divider />
            {outerContent}
            <Divider />
            <Comments
                type={type}
                id={parseInt(id as string, 10)}
                version={data?.version}
            />
        </Flex>
    )
}
