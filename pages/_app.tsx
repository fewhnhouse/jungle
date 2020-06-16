import { AppProps } from 'next/app'
import { SWRConfig } from 'swr'
import { ThemeProvider } from 'styled-components'

const theme = {
  colors: {
    primary: '#0070f3',
  },
}
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
          fetcher
        }}
      >
        <Component {...pageProps} />
      </SWRConfig>
    </ThemeProvider>
  )
}
