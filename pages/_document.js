import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  webp = (e) =>
    document
      .createElement("canvas")
      .toDataURL("image/webp")
      .indexOf("data:image/webp") == 0;

  render() {
    return (
      <Html>
        <Head>
          <script
            dangerouslySetInnerHTML={{
              __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-5MVFCZ9');`,
            }}
          />
        </Head>
        <body
          style={{
            backgroundImage: `url(${
              this.webp
                ? "https://ucarecdn.com/bd659922-683b-46c1-b32e-0ac53e7f54db/-/format/webp/"
                : "/assets/bg.jpg"
            })`,
          }}
        >
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
