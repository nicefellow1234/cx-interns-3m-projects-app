import { SessionProvider } from 'next-auth/react'
import '../styles/globals.css'

// This default export is required in a new `pages/_app.js` file.
export default function MyApp({ 
  Component, 
  pageProps : { session, ...pageProps }
}) {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  )
}