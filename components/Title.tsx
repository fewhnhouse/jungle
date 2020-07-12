import styled from 'styled-components'

// $ExpectError - not sure why
export default styled.h4`
    padding: 0px 8px;
    transition: background-color ease 0.2s;
    flex-grow: 1;
    user-select: none;
    position: relative;
    &:focus {
        outline: 2px solid red;
        outline-offset: 2px;
    }
`
