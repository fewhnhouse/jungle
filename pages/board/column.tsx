import styled from 'styled-components'
import {
    DraggableProvided,
    DraggableStateSnapshot,
    Draggable,
} from 'react-beautiful-dnd'
import IssueList from '../../components/IssueList'
import Title from '../../components/Title'
import { Issue } from '../../interfaces/Issue'

const Container = styled.div`
    margin: 10px;
    display: flex;
    flex-direction: column;
`

const Header = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
    background-color: ${({ isDragging }: { isDragging: boolean }) =>
        isDragging ? '#bdc3c7' : '#ecf0f1'};
    transition: background-color 0.2s ease;
    &:hover {
        background-color: #bdc3c7;
    }
`

type Props = {
    title: string
    issues: Issue[]
    index: number
    isScrollable?: boolean
    isCombineEnabled?: boolean
    useClone?: boolean
}

const Column = ({ title, issues, index, isScrollable }: Props) => {
    return (
        <Draggable draggableId={title} index={index}>
            {(
                provided: DraggableProvided,
                snapshot: DraggableStateSnapshot
            ) => (
                <Container ref={provided.innerRef} {...provided.draggableProps}>
                    <Header isDragging={snapshot.isDragging}>
                        <Title
                            {...provided.dragHandleProps}
                            aria-label={`${title} quote list`}
                        >
                            {title}
                        </Title>
                    </Header>
                    <IssueList
                        listId={title}
                        listType="QUOTE"
                        style={{
                            backgroundColor: snapshot.isDragging
                                ? '#34495e'
                                : null,
                        }}
                        issues={issues}
                        internalScroll={isScrollable}
                    />
                </Container>
            )}
        </Draggable>
    )
}

export default Column
