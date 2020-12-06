import '@snackbar/core/dist/snackbar.css'
import '../css/nprogress.css'
import '../css/codemirror.css'
import '../css/codemirror-monokai.css'
import '../css/tailwind.css'
import '../css/main.css'
import '../css/post.css'
import { Provider as UrqlProvider } from 'urql'
import React from 'react'
import { useRouter } from 'next/router'
import nprogress from 'nprogress'
import { getUrqlClient } from '@/lib/urql-client'

const App = ({ Component, pageProps }: any) => {
  const urqlClient = getUrqlClient()
  const router = useRouter()

  React.useEffect(() => {
    router.events.on('routeChangeStart', () => {
      nprogress.start()
    })
    router.events.on('routeChangeComplete', () => {
      nprogress.done()
    })
    router.events.on('routeChangeError', () => {
      nprogress.done()
    })
  }, [])

  return (
    <UrqlProvider value={urqlClient}>
      <Component {...pageProps} />
    </UrqlProvider>
  )
}

export default App
