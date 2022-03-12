import React, { useEffect, useState, useLayoutEffect } from "react";
import { ConnectionRejectedError, useWallet } from "use-wallet";
import Head from "next/head";
import { UseWalletProvider } from "use-wallet";
import bsc from "@binance-chain/bsc-use-wallet";
import { setCookie, destroyCookie } from "nookies";
import {
  BscConnector,
  UserRejectedRequestError,
} from "@binance-chain/bsc-connector";
import ReactGA from "react-ga";
import { IntercomProvider } from "react-use-intercom";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { MoralisProvider, useMoralis } from "react-moralis";
import { Router } from "next/dist/client/router";
import ProgressBar from "@badrap/bar-of-progress";
import Container from "react-bootstrap/Container";
import Axios from "axios";
import useSWR, { SWRConfig } from "swr";
import { getJWT } from "../utils/axios";
import Navbar from "../components/nav/HeaderNav";
import TOTMBanner from "../components/TOTMBanner";
import V2Banner from "../components/V2Banner";
import Footer from "../components/Footer";
import useTokenBalance from "../hooks/useTokenBalance";
import fetch from "../lib/fetchJson";
import { useRouter } from "next/router";
import TreatProvider from "../contexts/TreatProvider";

import "../styles/index.scss";
import "swiper/scss";
import "swiper/scss/navigation";
import "swiper/scss/pagination";
import { ChakraProvider } from "@chakra-ui/react";

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
  const oldTokenBalance = useTokenBalance(
    "0xac0c7d9b063ed2c0946982ddb378e03886c064e6"
  );
  const [requestedAuth, setRequestedAuth] = useState(false);
  const { status, account, connect } = useWallet();
  const { authenticate, logout, enableWeb3, user, isAuthenticated } =
    useMoralis();
  const router = useRouter();

  const { data: modelData } = useSWR(
    account && `/api/model/find-by-address/${account}`
  );

  useLayoutEffect(() => {
    enableWeb3();
  }, []);

  useEffect(() => {
    ReactGA.initialize("UA-207897573-1");

    //to report page view
    ReactGA.pageview(window.location.pathname + window.location.search);
  }, []);

  useLayoutEffect(() => {
    Axios.interceptors.response.use(
      (response) => {
        return response;
      },
      function (error) {
        const originalRequest = error.config;
        console.log("Got an error");

        if (
          error.response.status === 401 &&
          originalRequest.url.includes("refresh")
        ) {
          return Promise.reject(error);
        }

        if (error.response.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          // This means the refreshToken is not valid too, or has expired whatever
          // Let's log out moralis and show metamask login again to redo auth.
          // After that retry the original request
          return logout()
            .then(() => {
              console.log("Requesting auth");
              if (!requestedAuth) {
                setRequestedAuth(true);
                return authenticate()
                  .then((parsedUser) => {
                    setRequestedAuth(false);
                    return parsedUser;
                  })
                  .catch(() => {
                    setRequestedAuth(false);
                    throw {
                      error: "METAMASK_AUTH_CANCELLED",
                      message: "Metamask authentication cancelled",
                    };
                  });
              } else {
                if (isAuthenticated) {
                  return user;
                }
              }
            })
            .then((thisUser) => {
              if (thisUser || user) {
                return getJWT(thisUser || user);
              } else {
                throw {
                  error: "USER_NOT_AUTH",
                  message: "User is not authenticated",
                };
              }
            })
            .then(() => router.reload())
            .catch((err) => {
              console.log({ err });
              return Promise.reject(err);
            });
        }
        return Promise.reject(error);
      }
    );
  }, []);

  useEffect(() => {
    if (isAuthenticated && user) {
      getJWT(user).then(() => {
        if (router.pathname === "/auth") {
          const { redirectTo } = router.query;
          console.log("Got path match");
          console.log(redirectTo);
          if (redirectTo) {
            console.log("Redirecting to redirect");
            router.push(redirectTo);
          } else {
            console.log("Pushing to home");
            router.push("/");
          }
        }
      });
    }
  }, [isAuthenticated, user]);

  if (process.env.NEXT_PUBLIC_STOP) {
    return <>Supposed to be Public Stop</>;
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
          <ChakraProvider>
            <TreatProvider>
              <div>
                <TOTMBanner oldTokenBalance={oldTokenBalance} />
                {oldTokenBalance > 0 && (
                  <V2Banner oldTokenBalance={oldTokenBalance} />
                )}
                <Navbar modelData={modelData} />
                <Container style={{ minHeight: "75vh" }}>
                  <Component
                    {...pageProps}
                    modelData={modelData}
                    key={router.route}
                  />
                </Container>
                <Footer />
              </div>
            </TreatProvider>
          </ChakraProvider>
        </SWRConfig>
      </IntercomProvider>
    </ApolloProvider>
  );
}

function walletWrapper(props) {
  // Add context wrapper here which has account and status
  return (
    <MoralisProvider
      appId={"WZSAZ8e1qSzKZ0U7xRErmhoiYraqhoIyU0CCQ2bJ"}
      serverUrl={"https://ee15wkl2kmkl.usemoralis.com:2053/server"}
    >
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
              "https://divine-restless-feather.bsc.quiknode.pro/f9ead03ddd05508e4fe1f6952eea26ac035c8408/",
            chainId: 56,
          },
        }}
      >
        <MyApp {...props} />
      </UseWalletProvider>
    </MoralisProvider>
  );
}

export default walletWrapper;
