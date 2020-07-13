import styled from 'styled-components'

export default styled.h6`
    padding: 8px;
    margin: 0;
    transition: background-color ease 0.2s;
    flex-grow: 1;
    user-select: none;
    position: relative;
    &:focus {
        outline: 2px solid red;
        outline-offset: 2px;
    }
`
