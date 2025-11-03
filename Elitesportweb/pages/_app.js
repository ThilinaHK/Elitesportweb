import Head from 'next/head'
import Toast from '../components/Toast'
import ConfirmDialog from '../components/ConfirmDialog'

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Component {...pageProps} />
      <Toast />
      <ConfirmDialog />
    </>
  )
}