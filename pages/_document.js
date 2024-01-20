import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang='en'>
      <Head>
        <meta name='description' content='Ordinals Litecoin inscriptions.' />
        <meta
          name='keywords'
          content='LiteMap, inscription, bitcoin, brc20, nft, Ordinals, Litecoin'
        />
        <meta property='og:title' content={`LiteMap`} />
        <meta property='og:type' content='website' />
        <meta
          property='og:description'
          content={`Litecoin Ordinals marketplace | Buy & Sell Litecoin inscriptions`}
        />
        <meta property='og:url' content={`https://marketplace.ordinals.fun`} />
        <meta property='og:site_name' content='LiteMap'></meta>
        <meta
          property='og:image'
          content='https://marketplace.ordinals.fun/metaImage.jpg'
        ></meta>
        <meta property='og:image:type' content='image/jpg'></meta>
        <meta property='og:image:width' content='2000'></meta>
        <meta property='og:image:height' content='2000'></meta>
        <meta property='og:image:alt' content='dashboard'></meta>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
