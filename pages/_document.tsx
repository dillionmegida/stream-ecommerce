import React from 'react'
import Document, {
  Head,
  Main,
  NextScript,
  DocumentContext,
  DocumentInitialProps,
  Html,
} from 'next/document'
import { ServerStyleSheet } from 'styled-components'

export default class MyDocument extends Document<any> {
  static async getInitialProps(
    ctx: DocumentContext
  ): Promise<DocumentInitialProps> {
    // required because styled-components doesn't run on initial mount of components
    const sheet = new ServerStyleSheet()
    const originalRenderPage = ctx.renderPage

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp:
            (App) =>
            (props): React.ReactElement =>
              sheet.collectStyles(<App {...props} />),
        })

      const initialProps = await Document.getInitialProps(ctx)

      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        ),
      }
    } finally {
      sheet.seal()
    }
  }

  render(): JSX.Element {
    return (
      <Html>
        <Head>{this.props.styleTags}</Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
