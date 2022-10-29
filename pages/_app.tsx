import "../styles/index.css";
import "@rainbow-me/rainbowkit/styles.css";

import { Router } from "next/router";
import Axios from "axios";
import Head from "next/head";
import ProgressBar from "@badrap/bar-of-progress";
import { Container } from "packages/shared/components/Container";
import Navbar from "packages/navigation/Navbar";
import Footer from "packages/shared/components/Footer";
import { ThemeProvider } from "packages/theme";
import { FpjsProvider } from "@fingerprintjs/fingerprintjs-pro-react";
import WagmiWrapper from "core/chain/connect";
import Commandbar from "@packages/commandbar";

const progress = new ProgressBar({
  size: 3,
  color: "#805ad5",
  className: "bar-of-progress",
  delay: 100,
});
Router.events.on("routeChangeStart", progress.start);
Router.events.on("routeChangeComplete", progress.finish);
Router.events.on("routeChangeError", progress.finish);

Axios.defaults.withCredentials = true;

function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider>
      <FpjsProvider
        loadOptions={{
          apiKey: "5LG7UBlESl7pJPHsQjiI",
          region: "eu",
        }}
      >
        <Head>
          <title>Treat DAO</title>
          <meta name="title" content="Treat DAO" />
          <meta name="image" content="https://i.imgur.com/OEiuwp4.jpg" />
          <meta property="og:image" content="https://i.imgur.com/OEiuwp4.jpg" />

          <meta
            name="description"
            content="Treat is an exclusive platform for creators to sell NFTs. Hold $TREAT to have a say on which creators are chosen & new platform features."
          />
        </Head>
        <WagmiWrapper>
          <Commandbar />
          <div className="py-3">
            <Navbar />
          </div>
          <Container className="max-w-6xl mx-auto">
            <main className="mt-8">
              <Component {...pageProps} />
            </main>
          </Container>
          <div className="py-12">
            <Footer />
          </div>
        </WagmiWrapper>
      </FpjsProvider>
    </ThemeProvider>
  );
}

export default MyApp;
