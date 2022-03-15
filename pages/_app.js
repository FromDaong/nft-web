import React, { useEffect } from "react";
import Navbar from "../components/nav/HeaderNav";
import TOTMBanner from "../components/TOTMBanner";
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
import { parseCookies, setCookie, destroyCookie } from "nookies";
import {
  BscConnector,
  UserRejectedRequestError,
} from "@binance-chain/bsc-connector";
import { AnimatePresence } from "framer-motion";
import ReactGA from "react-ga";
import { IntercomProvider, useIntercom } from "react-use-intercom";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";

import { Router } from "next/dist/client/router";
import ProgressBar from "@badrap/bar-of-progress";

import "swiper/scss";
import "swiper/scss/navigation";
import "swiper/scss/pagination";

const progress = new ProgressBar({
  size: 3,
  color: "#805ad5",
  className: "bar-of-progress",
  delay: 100,
});

Router.events.on("routeChangeStart", progress.start);
Router.events.on("routeChangeComplete", progress.finish);
Router.events.on("routeChangeError", progress.finish);

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

  const client = new ApolloClient({
    uri: "https://api.thegraph.com/subgraphs/name/0x6e6f6c61/treat",
    cache: new InMemoryCache(),
  });

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

          if (res.success) {
            localStorage.removeItem("tx");
          }
        } catch (error) {
          console.error(error);
        }
      }
    })();
  }, [status]);

  useEffect(() => {
    if (status === "connected" && !account) {
      destroyCookie(null, "account");
    } else if (status === "disconnected" && !account) {
      destroyCookie(null, "account");
    } else if (status === "connected" && account) {
      setCookie(null, "account", account, {
        maxAge: 30 * 24 * 60 * 60,
        path: "/",
      });
    }
  }, [status, account]);

  useEffect(() => {
    // Unmounting component
    return () => {
      if (account) {
        setCookie(null, "account", account, {
          maxAge: 30 * 24 * 60 * 60,
          path: "/",
        });
      } else {
        destroyCookie(null, "account");
      }
    };
  }, []);

  return (
    <ApolloProvider client={client}>
      <IntercomProvider
        appId={"a3jgejbc"}
        autoBoot
        autoBootProps={{ name: account }}
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
              <TOTMBanner oldTokenBalance={oldTokenBalance} />
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
      </IntercomProvider>
    </ApolloProvider>
  );
}

function walletWrapper(props) {
  // Add context wrapper here which has account and status
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
          rpcUrl:
            "https://speedy-nodes-nyc.moralis.io/0e4b710bbd818e9709fe0ef5/bsc/mainnet",
          chainId: 56,
        },
      }}
    >
      <MyApp {...props} />
    </UseWalletProvider>
  );
}

export default walletWrapper;
