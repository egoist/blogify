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
              async
              defer
              data-website-id="58941d97-5f7e-469b-b1f7-b99324743a9c"
              src="https://analytics.blogify.dev/umami.js"
            ></script>
          )}
        </body>
      </Html>
    )
  }
}

export default MyDocument
