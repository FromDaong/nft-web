import Document, { Head, Html, Main, NextScript } from "next/document";

import Script from "next/script";

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  webp = () =>
    document
      .createElement("canvas")
      .toDataURL("image/webp")
      .indexOf("data:image/webp") == 0;

  render() {
    return (
      <Html>
        <Head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin="true"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400&display=swap"
            rel="stylesheet"
          />
          <Script
            strategy="lazyOnload"
            dangerouslySetInnerHTML={{
              __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-5MVFCZ9');`,
            }}
          />
        </Head>
        <body className="bg-white text-slate-600">
          <Main />
          <NextScript />
          {false && (
            <noscript>
              <iframe
                src="https://www.googletagmanager.com/ns.html?id=GTM-5MVFCZ9"
                height="0"
                width="0"
                style={{
                  display: "none",
                  visibility: "hidden",
                }}
              ></iframe>
            </noscript>
          )}
        </body>
      </Html>
    );
  }
}

export default MyDocument;
