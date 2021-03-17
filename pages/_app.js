import React, { useEffect, useState } from "react";
// import App from "next/app";
import Navbar from "../components/nav/HeaderNav";
import "../styles/index.scss";
import { SWRConfig } from "swr";
import fetch from "../lib/fetchJson";
import { useRouter } from "next/router";
import TreatProvider from "../contexts/TreatProvider";
import { useWallet } from "use-wallet";
import Container from "react-bootstrap/Container";
import Spinner from "react-bootstrap/Spinner";
import { UseWalletProvider } from "use-wallet";
import bsc from "@binance-chain/bsc-use-wallet";

const allowedRoutes = ["/"];

function MyApp({ Component, pageProps }) {
  const { status, account, connect } = useWallet();
  const router = useRouter();

  if (process.env.NEXT_PUBLIC_STOP) {
    return <PublicStop />;
  }

  useEffect(() => {
    if (status === "connected" && !account) connect("injected");

    const connectedBefore = localStorage.getItem("connectedBefore");
    if (connectedBefore && status === "disconnected") connect("injected");

    if (
      !connectedBefore &&
      status === "disconnected" &&
      allowedRoutes.indexOf(router.patname) === -1
    )
      router.push("/");
  }, [status]);

  return (
    <>
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
    </>
  );
}

function walletWrapper(props) {
  return (
    <UseWalletProvider
      chainId={56}
      connectors={{
        bsc,
        walletconnect: { rpcUrl: "https://bsc-dataseed.binance.org/" },
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
