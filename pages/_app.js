import React, { useEffect, useState } from "react";
// import App from "next/app";
import Navbar from "../components/nav/HeaderNav";
import V2Banner from "../components/V2Banner";
import Footer from "../components/Footer";
import useTokenBalance from "../hooks/useTokenBalance";
import "../styles/index.scss";
import useSWR, { SWRConfig } from "swr";
import fetch from "../lib/fetchJson";
import { useRouter } from "next/router";
import TreatProvider from "../contexts/TreatProvider";
import { useWallet } from "use-wallet";
import Container from "react-bootstrap/Container";
import Head from "next/head";
import { UseWalletProvider } from "use-wallet";
import bsc from "@binance-chain/bsc-use-wallet";
import {
  BscConnector,
  UserRejectedRequestError,
} from "@binance-chain/bsc-connector";
import { motion, AnimatePresence } from "framer-motion";
import ReactGA from "react-ga";

function MyApp({ Component, pageProps }) {
  const oldTokenBalance = useTokenBalance(
    "0xac0c7d9b063ed2c0946982ddb378e03886c064e6"
  );

  useEffect(() => {
    ReactGA.initialize("UA-207897573-1");

    //to report page view
    ReactGA.pageview(window.location.pathname + window.location.search);
  }, []);

  const { status, account, connect } = useWallet();
  const router = useRouter();

  const { data: modelData } = useSWR(
    account && `/api/model/find-by-address/${account}`
  );

  if (process.env.NEXT_PUBLIC_STOP) {
    return <PublicStop />;
  }

  useEffect(() => {
    (async () => {
      window.scrollTo(0, 0);
      if (status === "connected" && !account) connect("injected");

      const connectedBefore = localStorage.getItem("connectedBefore");
      if (connectedBefore && status === "disconnected") connect("injected");

      let tx = localStorage.getItem("tx");
      tx = JSON.parse(tx);

      if (tx && status === "connected" && account) {
        try {
          const res = await fetch(`/api/nft/${tx.nftId}`, {
            method: "PUT",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ mint: tx }),
          });

          console.log({ res });

          if (res.success) {
            localStorage.removeItem("tx");
          }
        } catch (error) {
          console.log(error);
        }
      }
    })();
  }, [status]);

  return (
    <>
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
      <SWRConfig
        value={{
          fetcher: fetch,
          onError: (err) => {
            console.error(err);
          },
        }}
      >
        <TreatProvider>
          <div>
            {oldTokenBalance > 0 && (
              <V2Banner oldTokenBalance={oldTokenBalance} />
            )}
            <Navbar modelData={modelData} />
            <Container style={{ minHeight: "75vh" }}>
              <AnimatePresence
                exitBeforeEnter
                onExitComplete={() => window.scrollTo(0, 0)}
              >
                <Component
                  {...pageProps}
                  modelData={modelData}
                  key={router.route}
                />
              </AnimatePresence>
            </Container>
            <Footer />
          </div>
        </TreatProvider>
      </SWRConfig>
    </>
  );
}

function walletWrapper(props) {
  return (
    <UseWalletProvider
      chainId={56}
      connectors={{
        bsc,
        bsw: {
          web3ReactConnector() {
            return new BscConnector({ supportedChainIds: [56] });
          },
          handleActivationError(err) {
            if (err instanceof UserRejectedRequestError) {
              return new ConnectionRejectedError();
            }
          },
        },
        walletconnect: {
          rpcUrl: "https://bsc-dataseed2.defibit.io",
          chainId: 56,
        },
      }}
    >
      <MyApp {...props} />
    </UseWalletProvider>
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

export default walletWrapper;
