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
    style?: React.CSSProperties
    wrap?: boolean
    children?: React.ReactNode | React.ReactNode[]
    className?: string
}

const StyledFlex = styled.div<FlexProps>`
    display: flex;
    width: ${({ fluid }) => (fluid ? '100%' : '')};
    height: ${({ fluid }) => (fluid ? '100%' : '')};
    flex-direction: ${({ direction }) => direction || 'row'};
    align-items: ${({ align }) => align || 'flex-start'};
    justify-content: ${({ justify }) => justify || 'flex-start'};
    flex-wrap: ${({ wrap }) => (wrap ? 'wrap' : '')};
`

const Flex = ({
    wrap,
    direction,
    justify,
    children,
    fluid,
    style,
    align,
    className,
}: FlexProps) => (
    <StyledFlex
        className={className}
        align={align}
        wrap={wrap}
        direction={direction}
        justify={justify}
        style={style}
        fluid={fluid}
    >
        {children}
    </StyledFlex>
)

export default Flex
