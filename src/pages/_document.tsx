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
              data-website-id="9939e642-1de9-4fdc-9407-c1cbd39cda4a"
              src="https://umami-stats.vercel.app/umami.js"
            ></script>
          )}
        </body>
      </Html>
    )
  }
}

export default MyDocument
