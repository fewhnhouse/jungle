import { AppProps } from 'next/app'
import { SWRConfig } from 'swr'
import styled, { ThemeProvider } from 'styled-components'
import './app.less'
// import 'bootstrap/dist/css/bootstrap.min.css'
// import 'shards-ui/dist/css/shards.min.css'
// import 'react-markdown-editor-lite/lib/index.css'
import Header from '../components/header/Header'
import axios from 'axios'
import { useState, useEffect } from 'react'
import 'rsuite/lib/styles/index.less'

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
    spacing: {
        mini: string
        small: string
        medium: string
        big: string
        huge: string
        crazy: string
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
    spacing: {
        mini: '4px',
        small: '8px',
        medium: '16px',
        big: '32px',
        huge: '48px',
        crazy: '64px',
    },
}

const AppContainer = styled.main`
    height: calc(100vh - 60px);
    margin-top: 60px;
    background-size: cover;
`

axios.defaults.baseURL = process.env.NEXT_PUBLIC_TAIGA_API_URL

/*
const graphqlFetcher = (query) =>
    fetch('/api/graphql', {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
        },
        body: JSON.stringify({ query }),
    })
        .then((res) => res.json())
        .then((json) => json.data)
*/

const createFetcher = (token: string) => (url: string) =>
    axios
        .get(url, { headers: { Authorization: `Bearer ${token}` } })
        .then((res) => res.data)

export default function App({ Component, pageProps }: AppProps) {
    const [token, setToken] = useState('')
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const token = localStorage.getItem('auth-token')
        setToken(token)
        setLoading(false)
    }, [])
    return loading ? null : (
        <ThemeProvider theme={theme}>
            <SWRConfig
                value={{
                    fetcher: createFetcher(token),
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
