import Board from '../../../../components/board/Board'
import { columns, sprint } from '../../../../util/data'
import styled from 'styled-components'

const ParentContainer = styled.div``

export default function BoardContainer() {
    return (
        <ParentContainer>
            <Board id="board-1" data={sprint} columns={columns} />
            <Board id="board-2" data={sprint} columns={columns} />
            <Board id="board-3" data={sprint} columns={columns} />
            <Board id="board-4" data={sprint} columns={columns} />
        </ParentContainer>
    )
}
