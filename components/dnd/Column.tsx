import styled from 'styled-components'
import {
    DraggableProvided,
    DraggableStateSnapshot,
    Draggable,
} from 'react-beautiful-dnd'
import IssueList from './List'
import Title from '../Title'
import { Theme } from '../../pages/_app'
import { Task } from '../../taiga-api/tasks'
import { UserStory } from '../../taiga-api/userstories'

const Container = styled.div`
    margin: ${({ theme }) => theme.spacing.small};
    display: flex;
    flex-direction: column;
    width: 250px;
`

interface HeaderProps {
    isDragging: boolean
    theme: Theme
}
const Header = styled.div<HeaderProps>`
    display: flex;
    align-items: center;
    justify-content: center;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
    background-color: ${({ isDragging, theme }) =>
        isDragging ? theme.colors.grey.dark : theme.colors.grey.light};
    transition: background-color 0.2s ease;
    &:hover {
        background-color: ${({ theme }) => theme.colors.grey.normal};
    }
`

type Props = {
    title: string
    issues: (Task | UserStory)[]
    id: number
    index: number
    isScrollable?: boolean
    isCombineEnabled?: boolean
    useClone?: boolean
}

const Column = ({ title, issues, index, id }: Props) => {
    return (
        <Draggable draggableId={title + id} index={index}>
            {(
                provided: DraggableProvided,
                snapshot: DraggableStateSnapshot
            ) => (
                <Container ref={provided.innerRef} {...provided.draggableProps}>
                    <Header isDragging={snapshot.isDragging}>
                        <Title
                            {...provided.dragHandleProps}
                            aria-label={`${title} task list`}
                        >
                            {title}
                        </Title>
                    </Header>
                    <IssueList
                        listId={id + ''}
                        listType="QUOTE"
                        style={{
                            backgroundColor: snapshot.isDragging
                                ? '#34495e'
                                : null,
                        }}
                        issues={issues}
                    />
                </Container>
            )}
        </Draggable>
    )
}

export default Column
