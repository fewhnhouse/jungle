import { AppProps } from 'next/app'
import { SWRConfig } from 'swr'
import styled, { ThemeProvider } from 'styled-components'
import './app.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'shards-ui/dist/css/shards.min.css'
import 'react-markdown-editor-lite/lib/index.css'

const theme = {
    colors: {
        primary: '#0070f3',
    },
}

const AppContainer = styled.main`
    height: 100vh;
    width: 100vw;
`

const fetcher = (query) =>
    fetch('/api/graphql', {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
        },
        body: JSON.stringify({ query }),
    })
        .then((res) => res.json())
        .then((json) => json.data)

export default function App({ Component, pageProps }: AppProps) {
    return (
        <ThemeProvider theme={theme}>
            <SWRConfig
                value={{
                    fetcher,
                }}
            >
                <AppContainer>
                    <Component {...pageProps} />
                </AppContainer>
            </SWRConfig>
        </ThemeProvider>
    )
}
