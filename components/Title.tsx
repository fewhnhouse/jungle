import styled from 'styled-components'

export default styled.h3`
    padding: ${({ theme }) => theme.spacing.small};
    margin: 0;
    transition: background-color ease 0.2s;
    flex-grow: 1;
    user-select: none;
    position: relative;
`
