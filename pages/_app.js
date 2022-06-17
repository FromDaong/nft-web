import "../styles/index.scss";
import "swiper/scss";
import "swiper/scss/navigation";
import "swiper/scss/pagination";
import "react-image-lightbox/style.css";

import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { MoralisProvider, useMoralis } from "react-moralis";
import { Router, useRouter } from "next/router";
import { destroyCookie, setCookie } from "nookies";
import { useEffect, useState } from "react";

import Axios from "axios";
import { ChakraProvider } from "@chakra-ui/provider";
import Container from "react-bootstrap/Container";
import Footer from "@components/Footer";
import Head from "next/head";
import { IntercomProvider } from "react-use-intercom";
import Navbar from "@components/nav/HeaderNav";
import ProgressBar from "@badrap/bar-of-progress";
import ReactGA from "react-ga";
import { SWRConfig } from "swr";
import TreatProvider from "@contexts/TreatProvider";
import dynamic from "next/dynamic";
import fetch from "@lib/fetchJson";
import theme from "@styles/theme";
import useTokenBalance from "@hooks/useTokenBalance";

const V2Banner = dynamic(() =>
  import("@components/V2Banner").then((c) => c.default)
);
const TOTMBanner = dynamic(() =>
  import("@components/TOTMBanner").then((c) => c.default)
);

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
  const { user, isAuthenticated, account } = useMoralis();
  const router = useRouter();

  const [modelData] = useState(null);

  useEffect(() => {
    if (isAuthenticated && account && user) {
      Axios.post("/api/v2/auth/get-jwt", {
        ethAddress: account,
        sessionToken: user.getSessionToken(),
        username: user.getUsername(),
      });
    }
  }, [isAuthenticated, account, user]);

  useEffect(() => {
    ReactGA.initialize("UA-207897573-1");

    //to report page view
    ReactGA.pageview(window.location.pathname + window.location.search);
  }, []);

  useEffect(() => {
    if (user && user?.isNew()) {
      // Create user in model with isModel false
      Axios.post("/api/model/become", {
        address: account,
        isModel: false,
        username:
          user.getUsername() ??
          account.substring(0, 6) + "..." + account.substr(-5),
        bio: "I am a new Treat explorer",
        display_name: user.getUsername() ?? account,
      })
        .then(() => router.reload())
        .then(() => router.reload())
        .catch((err) => {
          console.log({ err });
        });
    }
  }, [user]);

  if (process.env.NEXT_PUBLIC_STOP) {
    return <>Supposed to be Public Stop</>;
  }

  useEffect(() => {
    (async () => {
      window.scrollTo(0, 0);
      let tx = localStorage.getItem("tx");
      tx = JSON.parse(tx);

      if (tx && isAuthenticated && account) {
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
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated && !account) {
      destroyCookie(null, "account");
    } else if (!isAuthenticated && !account) {
      destroyCookie(null, "account");
    } else if (isAuthenticated && account) {
      setCookie(null, "account", account, {
        maxAge: 30 * 24 * 60 * 60,
        path: "/",
      });
    }
  }, [isAuthenticated, account]);

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
    <TreatProvider>
      <TOTMBanner oldTokenBalance={oldTokenBalance} />
      <Container style={{ minHeight: "75vh" }}>
        <div className="w-screen h-screen">
          <div className="container mx-auto flex justify-center align-center">
            <h1 className="text-3xl">Coming back soon</h1>
            <p className="text-lg">We are working on major security fixes and will be back soon!</p>
          </div>
        </div>
      </Container>
      <Footer />
    </TreatProvider>
  );
    /*
  return (
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
          <TOTMBanner oldTokenBalance={oldTokenBalance} />
          {oldTokenBalance > 0 && (
            <V2Banner oldTokenBalance={oldTokenBalance} />
          )}
          <Navbar modelData={modelData} />
          <Container style={{ minHeight: "75vh" }}>
            <Component {...pageProps} modelData={modelData} y={router.route} />
          </Container>
          <Footer />
        </TreatProvider>
      </SWRConfig>
    </IntercomProvider>
  );*/
}

function walletWrapper(props) {
  // Add context wrapper here which has account and status
  const client = new ApolloClient({
    uri: "https://api.thegraph.com/subgraphs/name/0x6e6f6c61/treat",
    cache: new InMemoryCache(),
  });

  return (
    <ApolloProvider client={client}>
      <MoralisProvider
        appId={"WZSAZ8e1qSzKZ0U7xRErmhoiYraqhoIyU0CCQ2bJ"}
        serverUrl={"https://ee15wkl2kmkl.usemoralis.com:2053/server"}
      >
        <ChakraProvider theme={theme}>
          <MyApp {...props} />
        </ChakraProvider>
      </MoralisProvider>
    </ApolloProvider>
  );
}

export default walletWrapper;

// trigger deploy
