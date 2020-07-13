import { useState } from 'react'
import Column from './column'
import reorder, { reorderQuoteMap } from './reorder'
import {
    DragDropContext,
    DropResult,
    DraggableLocation,
    DroppableProvided,
    Droppable,
} from 'react-beautiful-dnd'
import styled from 'styled-components'
import { Issue } from '../../interfaces/Issue'
import ExpandLessIcon from '@material-ui/icons/ExpandLess'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import { Collapse } from 'react-collapse'

const Container = styled.div`
    min-width: 100vw;
    display: inline-flex;
`

const BoardContainer = styled.div`
    width: 100%;
    overflow: auto;
`

const StoryHeader = styled.div`
    height: 30px;
    margin: 5px 10px;
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 0px 10px;
    background-color: ${({ theme }) => theme.colors.grey.light};
    border-radius: 4px;
    transition: background-color 0.2s ease;
    cursor: pointer;
    &:hover,
    &:active {
        background-color: ${({ theme }) => theme.colors.grey.normal};
    }
`

const StoryTitle = styled.h6`
    margin: 0;
    padding: 0px 10px;
`

type Props = {
    id: string
    data: Issue[]
    columns: string[]
    withScrollableColumns?: boolean
}

const Board = ({ id, data, columns, withScrollableColumns }: Props) => {
    /* eslint-disable react/sort-comp */
    const [expanded, setExpanded] = useState(true)
    const [issues, setColumns] = useState(data)
    const [ordered, setOrdered] = useState(columns)

    const onDragEnd = (result: DropResult) => {
        // dropped nowhere
        if (!result.destination) {
            return
        }

        const source: DraggableLocation = result.source
        const destination: DraggableLocation = result.destination

        // did not move anywhere - can bail early
        if (
            source.droppableId === destination.droppableId &&
            source.index === destination.index
        ) {
            return
        }

        // reordering column
        if (result.type === 'COLUMN') {
            const reordered: string[] = reorder(
                ordered,
                source.index,
                destination.index
            )

            setOrdered(reordered)

            return
        }

        const data = reorderQuoteMap({
            issueMap: issues,
            source,
            destination,
        })

        setColumns(data.issueMap)
    }

    const toggleVisibility = () => setExpanded((expanded) => !expanded)

    return (
        <>
            <StoryHeader onClick={toggleVisibility}>
                {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                <StoryTitle>Story</StoryTitle>
            </StoryHeader>
            <Collapse isOpened={expanded}>
                <BoardContainer>
                    <DragDropContext onDragEnd={onDragEnd}>
                        <Droppable
                            droppableId={id}
                            type="COLUMN"
                            direction="horizontal"
                        >
                            {(provided: DroppableProvided) => (
                                <Container
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                >
                                    {ordered.map(
                                        (key: string, index: number) => (
                                            <Column
                                                key={key}
                                                index={index}
                                                title={key}
                                                issues={issues.filter(
                                                    (data) =>
                                                        data.status === key
                                                )}
                                                isScrollable={
                                                    withScrollableColumns
                                                }
                                            />
                                        )
                                    )}
                                    {provided.placeholder}
                                </Container>
                            )}
                        </Droppable>
                    </DragDropContext>
                </BoardContainer>
            </Collapse>
        </>
    )
}

export default Board
