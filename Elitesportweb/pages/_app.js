import Head from 'next/head'

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/img/eliet_logo.jpg" />
      </Head>
      <Component {...pageProps} />
    </>
  )
}