import React, { useEffect } from "react";
// import App from "next/app";
import Navbar from "../components/nav/HeaderNav";
import "../styles/index.scss";
import { SWRConfig } from "swr";
import fetch from "../lib/fetchJson";
import Head from "next/head";
import TreatProvider from "../contexts/TreatProvider";
import Container from "react-bootstrap/Container";
import { UseWalletProvider } from "use-wallet";
import bsc from "@binance-chain/bsc-use-wallet";

function MyApp({ Component, pageProps }) {
  if (process.env.NEXT_PUBLIC_STOP) {
    return <PublicStop />;
  }

  return (
    <>
      <UseWalletProvider
        chainId={56}
        connectors={{
          bsc,
          walletconnect: { rpcUrl: "https://bsc-dataseed.binance.org/" },
        }}
      >
        <SWRConfig
          value={{
            fetcher: fetch,
            onError: (err) => {
              console.error(err);
            },
          }}
        >
          <TreatProvider>
            <div className="pink-bg">
              <Navbar />

              <Container>
                <Component {...pageProps} />
              </Container>
            </div>
          </TreatProvider>
        </SWRConfig>
      </UseWalletProvider>
    </>
  );
}

// Only uncomment this method if you have blocking data requirements for
// every single page in your application. This disables the ability to
// perform automatic static optimization, causing every page in your app to
// be server-side rendered.
//

// MyApp.getInitialProps = async () => {
//   const res = await fetch(`/api/brand/get`);
//   const data = await res.json();

//   console.log(res, data);

//   return { brand: data };
// };

export default MyApp;
