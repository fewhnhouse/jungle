import { AppProps } from 'next/app'
import { SWRConfig } from 'swr'
import styled, { ThemeProvider } from 'styled-components'
import './app.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'shards-ui/dist/css/shards.min.css'
import 'react-markdown-editor-lite/lib/index.css'
import Header from '../components/header/Header'

export interface Theme {
    colors: {
        primary: string
        grey: {
            light: string
            normal: string
            dark: string
        }
        darkgrey: {
            light: string
            normal: string
            dark: string
        }
    }
}
const theme = {
    colors: {
        primary: '#0070f3',
        grey: {
            light: '#e9ecef',
            normal: '#dadfe4',
            dark: '#bdc3c7',
        },
        darkgrey: {
            light: '#95a5a6',
            normal: '#7f8c8d',
            dark: '#34495e',
        },
    },
}

const AppContainer = styled.main`
    height: calc(100vh - 70px);
    margin-top: 70px;
    background-image: url(jungle.png);
    background-size: cover;
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
                <Header />
                <AppContainer>
                    <Component {...pageProps} />
                </AppContainer>
            </SWRConfig>
        </ThemeProvider>
    )
}
