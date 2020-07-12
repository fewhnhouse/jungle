import Board from './board'
import { authorQuoteMap, columns, sprint } from '../../util/data'
import styled from 'styled-components'

const ParentContainer = styled.div`
    min-height: 100vh;
    min-width: 100vw;
    overflow-x: auto;
    overflow-y: auto;
`

export default () => {
    return (
        <ParentContainer>
            <Board id="board-1" data={sprint} columns={columns} />
            <Board id="board-2" data={sprint} columns={columns} />
        </ParentContainer>
    )
}
