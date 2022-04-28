import "../styles/index.scss";
import "swiper/scss";
import "swiper/scss/navigation";
import "swiper/scss/pagination";
import "react-image-lightbox/style.css";

import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { ChakraProvider, extendTheme, useToast } from "@chakra-ui/react";
import { MoralisProvider, useMoralis } from "react-moralis";
import { destroyCookie, setCookie } from "nookies";
import { useEffect, useState } from "react";

import Axios from "axios";
import Container from "react-bootstrap/Container";
import Footer from "../components/Footer";
import Head from "next/head";
import { IntercomProvider } from "react-use-intercom";
import Navbar from "../components/nav/HeaderNav";
import ProgressBar from "@badrap/bar-of-progress";
import ReactGA from "react-ga";
import { Router } from "next/dist/client/router";
import { SWRConfig } from "swr";
import TOTMBanner from "../components/TOTMBanner";
import TreatProvider from "../contexts/TreatProvider";
import V2Banner from "../components/V2Banner";
import fetch from "../lib/fetchJson";
import { getJWT } from "../utils/axios";
import { useRouter } from "next/router";
import useTokenBalance from "../hooks/useTokenBalance";

const progress = new ProgressBar({
  size: 3,
  color: "#805ad5",
  className: "bar-of-progress",
  delay: 100,
});
Router.events.on("routeChangeStart", progress.start);
Router.events.on("routeChangeComplete", progress.finish);
Router.events.on("routeChangeError", progress.finish);

const theme = extendTheme({
  colors: {
    secondary: {
      50: "#F1EBFA",
      100: "#D9C7F0",
      200: "#C1A3E6",
      300: "#A87EDC",
      400: "#905AD3",
      500: "#7736C9",
      600: "#602BA1",
      700: "#482178",
      800: "#301650",
      900: "#180B28",
    },
    primary: {
      50: "#FCE8EF",
      100: "#F8BFD4",
      200: "#F396B8",
      300: "#EE6D9C",
      400: "#E94380",
      500: "#E94380",
      600: "#B71550",
      700: "#89103C",
      800: "#5B0B28",
      900: "#2E0514",
    },
  },
});

Axios.defaults.withCredentials = true;

function MyApp({ Component, pageProps }) {
  const oldTokenBalance = useTokenBalance(
    "0xac0c7d9b063ed2c0946982ddb378e03886c064e6"
  );
  const [requestedAuth, setRequestedAuth] = useState(false);
  const { authenticate, logout, user, isAuthenticated, account } = useMoralis();
  const router = useRouter();
  const toast = useToast();

  const [modelData, setModelData] = useState({});

  useEffect(() => {
    if (isAuthenticated) {
      if (localStorage.getItem("tokens")) {
        Axios.get(`/api/v2/auth/me`).then((res) => {
          setModelData(res.data);
        });
      }
    }
  }, [isAuthenticated]);

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
        username: account.substring(0, 6) + "..." + account.substr(-5),
        bio: "I am a new Treat explorer",
        display_name: account,
      })
        .then(() =>
          toast({
            title: "Account created",
            description: "You can now treat yourself with your new account",
            status: "success",
            duration: 2000,
          })
        )
        .catch((err) => {
          console.log({ err });
          toast({
            title: "Oops. That was an error",
            description:
              "We failed to create your Treat account. Please try again",
            duration: 4000,
          });
        });
    }
  }, [user]);

  useEffect(() => {
    Axios.interceptors.response.use(
      (response) => {
        return response;
      },
      function (error) {
        const originalRequest = error.config;
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
            .then(() => localStorage.removeItem("tokens"))
            .then(() => {
              if (!requestedAuth) {
                console.log({ requestedAuth });
                console.log("Requesting auth");
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
          console.log(redirectTo);
          if (redirectTo) {
            router.push(redirectTo);
          } else {
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
            <TOTMBanner oldTokenBalance={oldTokenBalance} />
            {oldTokenBalance > 0 && (
              <V2Banner oldTokenBalance={oldTokenBalance} />
            )}
            <Navbar modelData={modelData} />
            <Container style={{ minHeight: "75vh" }}>
              {modelData ? (
                <Component
                  {...pageProps}
                  modelData={modelData}
                  key={router.route}
                />
              ) : (
                <div>Please wait fetching your profile details.</div>
              )}
            </Container>
            <Footer />
          </TreatProvider>
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
      <ChakraProvider theme={theme}>
        <MyApp {...props} />
      </ChakraProvider>
    </MoralisProvider>
  );
}

export default walletWrapper;
