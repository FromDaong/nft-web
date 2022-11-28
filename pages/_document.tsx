import { getCssText, styled } from "@styles/theme";
import Document, { Head, Html, Main, NextScript } from "next/document";

import Script from "next/script";

const Body = styled("body", {
  backgroundColor: "$surface",
  color: "$text",
});
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
          <link rel="icon" type="image/x-icon" href="/favicon.ico" />
          <link rel="shortcut icon" type="image/x-icon" href="/favicon.ico" />
          <link
            href="/favicon-16x16.png"
            rel="icon"
            type="image/png"
            sizes="16x16"
          />
          <link
            href="/favicon-32x32.png"
            rel="icon"
            type="image/png"
            sizes="32x32"
          />
          <link rel="apple-touch-icon" href="/apple-touch-icon.png"></link>
          <link rel="manifest" href="/site.webmanifest" />
          <meta
            name="description"
            content="Spicy content. Directly from the Creators"
          />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin="true"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700&display=swap"
            rel="stylesheet"
          />
          <meta name="theme-color" content="#333333" />
          <meta name="referrer" content={"strict-origin"} />
          <style
            id="stitches"
            dangerouslySetInnerHTML={{ __html: getCssText() }}
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
        <Body className="antialised">
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
        </Body>
      </Html>
    );
  }
}

export default MyDocument;
