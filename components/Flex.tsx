import React from 'react'
import styled from 'styled-components'

export interface FlexProps {
    direction?: 'column' | 'row'
    justify?:
        | 'center'
        | 'flex-start'
        | 'flex-end'
        | 'space-evenly'
        | 'space-around'
        | 'space-between'
    align?:
        | 'center'
        | 'flex-start'
        | 'flex-end'
        | 'space-evenly'
        | 'space-around'
        | 'space-between'
    fluid?: boolean
    wrap?: boolean
    style?: React.CSSProperties
    className?: string
    children?: React.ReactNode | React.ReactNode[]
}

interface OwnFlexProps {
    $direction?: 'column' | 'row'
    $justify?:
        | 'center'
        | 'flex-start'
        | 'flex-end'
        | 'space-evenly'
        | 'space-around'
        | 'space-between'
    $align?:
        | 'center'
        | 'flex-start'
        | 'flex-end'
        | 'space-evenly'
        | 'space-around'
        | 'space-between'
    $fluid?: boolean
    $wrap?: boolean
    style?: React.CSSProperties
    className?: string
    children?: React.ReactNode | React.ReactNode[]
}

const StyledFlex = styled.div<OwnFlexProps>`
    display: flex;
    width: ${({ $fluid }) => ($fluid ? '100%' : '')};
    height: ${({ $fluid }) => ($fluid ? '100%' : '')};
    flex-direction: ${({ $direction }) => $direction || 'row'};
    align-items: ${({ $align }) => $align || 'flex-start'};
    justify-content: ${({ $justify }) => $justify || 'flex-start'};
    flex-wrap: ${({ $wrap }) => ($wrap ? 'wrap' : '')};
`

const Flex = ({
    wrap,
    direction,
    justify,
    fluid,
    align,
    children,
    className,
    style,
}: FlexProps) => (
    <StyledFlex
        $align={align}
        $wrap={wrap}
        $direction={direction}
        $justify={justify}
        $fluid={fluid}
        className={className}
        style={style}
    >
        {children}
    </StyledFlex>
)

export default Flex
