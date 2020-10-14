import styled from "styled-components";

const PageHeaderInner = styled.div`
    max-width: 1400px;
    padding: 20px;
    margin: auto;
`

const PageHeaderOuter = styled.div`
    width: 100%;
    margin-top: 60px;
    border-bottom: 1px solid #e5e5ea;
`

interface Props {
    children: React.ReactNode
}

export const PageHeader = ({children}: Props) => {
    return (
        <PageHeaderOuter>
            <PageHeaderInner>
                {children}
            </PageHeaderInner>
        </PageHeaderOuter>
    )
}

export const PageBody = styled.div`
    max-width: 1400px;
    margin: auto;
    padding: 20px;
`