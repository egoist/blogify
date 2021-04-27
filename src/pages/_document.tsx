import Document, { Html, Head, Main, NextScript } from 'next/document'

const isProd = process.env.NODE_ENV === 'production'

class MyDocument extends Document {
  static async getInitialProps(ctx: any) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render() {
    return (
      <Html>
        <Head />
        <body>
          <Main />
          <NextScript />
          {isProd && (
            <script
              defer
              src="https://static.cloudflareinsights.com/beacon.min.js"
              data-cf-beacon='{"token": "4a5d7c2e5531404abccfc7f3bed651fa"}'
            ></script>
          )}
        </body>
      </Html>
    )
  }
}

export default MyDocument
