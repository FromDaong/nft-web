import React, { useState, useEffect } from "react";
import Spinner from "react-bootstrap/Spinner";
import MyNFTItem from "../components/MyNFTItem";
import TransferNFTModal from "../components/TransferNFTModal";
import ListOrderModal from "../components/ListOrderModal";
import CancelOrderModal from "../components/CancelOrderModal";
import Hero from "../components/Hero";
import Button from "react-bootstrap/Button";
import useGetNftMaxSupply from "../hooks/useGetNftMaxSupply";
import useGetNftBalance from "../hooks/useGetNftBalance";
import useGetOpenOrdersForSeller from "../hooks/useGetOpenOrdersForSeller";
import useWallet from "use-wallet";
import useSWR from "swr";
import Layout from "../components/Layout";

const MyNFTsWrapper = () => {
  const { account, status } = useWallet();

  const { data: res } = useSWR(`/api/nft`);
  const [nftArray, setNftData] = useState();

  useEffect(() => {
    (async () => {
      if (res) {
        setNftData(res);
      }
    })();
  }, [res]);

  if (status !== "connected" || !nftArray) {
    return (
      <div
        style={{
          position: "fixed",
          width: "100%",
          height: "100%",
          display: "flex",
          top: 0,
          left: 0,
          justifyContent: "center",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h5
          style={{
            fontWeight: "bolder",
            background: "white",
            borderRadius: 5,
            padding: 10,
          }}
        >
          Please make sure your wallet on the Binance Smart Chain is connected.
        </h5>
        <Spinner
          animation="border"
          role="status"
          size="xl"
          style={{ marginTop: 5 }}
        >
          <span className="sr-only">Loading...</span>
        </Spinner>
      </div>
    );
  } else {
    return <ViewNFT account={account} nftArray={nftArray} />;
  }
};

const OwnedNfts = ({
  hideNFTs,
  revealNFTs,
  nftBalances,
  transferNFTClick,
  listOrderClick,
  serverNftBalances,
}) => {
  return (
    <div className="white-tp-bg" style={{ minHeight: 400 }}>
      <div
        className="px-4 py-2 w-100 d-flex"
        style={{
          background: "#FFFDF2",
          justifyContent: "space-between",
          alignItems: "center",
          borderRadius: 8,
        }}
      >
        <div>
          <h2
            className="heading-text-primary pt-1"
            style={{
              fontSize: 24,
            }}
          >
            MY NFTs
          </h2>
        </div>
        {nftBalances.length > 0 && (
          <div className="button-container">
            {serverNftBalances ? (
              <Button variant="secondary  w-sm-100" onClick={hideNFTs}>
                <b>{"HIDE CONTENTS 🙈"}</b>
              </Button>
            ) : (
              <Button variant="primary  w-sm-100" onClick={revealNFTs}>
                <b>{"REVEAL CONTENTS 👀"}</b>
              </Button>
            )}
          </div>
        )}
      </div>
      {nftBalances.length > 0 ? (
        <div className="container px-4 px-md-0">
          <div className="row d-flex flex-wrap text-left justify-content-center mt-5">
            {nftBalances.map((nft) => {
              return (
                nft.balance > 0 && (
                  <div className="col-xl-4 col-md-6 px-4">
                    <MyNFTItem
                      data={nft}
                      revealNFTs={revealNFTs}
                      transferNFTClick={transferNFTClick}
                      listOrderClick={listOrderClick}
                    />
                  </div>
                )
              );
            })}
          </div>
        </div>
      ) : (
        <div
          className="w-100 text-center font-weight-bold d-flex align-items-center justify-content-center h-100"
          style={{
            color: "#333",
            marginTop: -20,
            height: "100%",
            minHeight: 200,
          }}
        >
          You haven't purchased any NFTs yet.
        </div>
      )}
    </div>
  );
};

const OpenOrders = ({
  hideNFTs,
  revealNFTs,
  nftBalances,
  transferNFTClick,
  cancelOrderClick,
  serverNftBalances,
}) => {
  return (
    <div className="white-tp-bg" style={{ minHeight: 400 }}>
      <div
        className="px-4 py-2 w-100 d-flex"
        style={{
          background: "#FFFDF2",
          justifyContent: "space-between",
          alignItems: "center",
          borderRadius: 8,
        }}
      >
        <div>
          <h2
            className="heading-text-primary pt-1"
            style={{
              fontSize: 24,
            }}
          >
            OPEN ORDERS
          </h2>
        </div>
        {nftBalances.length > 0 && (
          <div className="button-container">
            {serverNftBalances ? (
              <Button variant="secondary  w-sm-100" onClick={hideNFTs}>
                <b>{"HIDE CONTENTS 🙈"}</b>
              </Button>
            ) : (
              <Button variant="primary  w-sm-100" onClick={revealNFTs}>
                <b>{"REVEAL CONTENTS 👀"}</b>
              </Button>
            )}
          </div>
        )}
      </div>
      {nftBalances.length > 0 ? (
        <div className="container px-4 px-md-0">
          <div className="row d-flex flex-wrap text-left justify-content-center mt-5">
            {nftBalances.map((nft) => {
              return (
                nft.hasOpenOrder && (
                  <div className="col-xl-4 col-md-6 px-4">
                    <MyNFTItem
                      data={nft}
                      revealNFTs={revealNFTs}
                      cancelOrderClick={cancelOrderClick}
                    />
                  </div>
                )
              );
            })}
          </div>
        </div>
      ) : (
        <div
          className="w-100 text-center font-weight-bold d-flex align-items-center justify-content-center h-100"
          style={{
            color: "#333",
            marginTop: -20,
            height: "100%",
            minHeight: 200,
          }}
        >
          You haven't purchased any NFTs yet.
        </div>
      )}
    </div>
  );
};

const ViewNFT = ({ account, nftArray }) => {
  const [serverNftBalances, setServerNftBalances] = useState(null);

  const maxNftSupply = useGetNftMaxSupply(account);
  const nftBalancesInitial = useGetNftBalance(nftArray);
  console.log({ nftBalancesInitial });

  const nftBalances = serverNftBalances || nftBalancesInitial;
  const [transferNFTData, setTransferNFTData] = useState(null);
  const [listOrderData, setListOrderData] = useState(null);
  const [cancelOrderData, setCancelOrderData] = useState(null);

  const transferNFTClick = (x) => {
    setTransferNFTData(x);
  };

  const listOrderClick = (x) => {
    setListOrderData(x);
  };

  const cancelOrderClick = (x) => {
    setCancelOrderData(x);
  };

  const hideNFTs = async () => {
    setServerNftBalances(null);
  };

  const revealNFTs = async () => {
    if (account && treat) {
      const signature = await treat.signMessage(account, "Reveal Contents");

      const nftIds = nftArray.map((n) => n.id);

      const res = await fetch(`/api/nft/view-nfts`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nft_ids: nftIds, signature }),
      });
      const resJSON = await res.json();

      if (resJSON.success) {
        setServerNftBalances(resJSON.results);
      }
    }
  };

  return (
    <Layout>
      <div className="container  my-nft-container">
        <TransferNFTModal
          show={!!transferNFTData}
          data={transferNFTData}
          handleClose={() => setTransferNFTData(false)}
        />
        <ListOrderModal
          show={!!listOrderData}
          data={listOrderData}
          handleClose={() => setListOrderData(false)}
        />
        <CancelOrderModal
          show={!!cancelOrderData}
          data={cancelOrderData}
          handleClose={() => setCancelOrderData(false)}
          account={account}
        />
        <Hero
          title={"My NFTs"}
          subtitle={`Connected wallet address: ${account}`}
        />
        {/* <div className="white-tp-bg mt-4 p-3">
          <p className="w-100 mb-0" style={{ wordBreak: "break-word" }}>
            <b>Connected wallet address:</b>
            <div>{`${account}`}</div>
          </p>
        </div> */}
        <div className="mt-2">
          <OwnedNfts
            hideNFTs={hideNFTs}
            listOrderClick={listOrderClick}
            transferNFTClick={transferNFTClick}
            nftBalances={nftBalances}
            revealNFTs={revealNFTs}
            serverNftBalances={serverNftBalances}
          />
        </div>
        <div className="mt-2">
          <OpenOrders
            hideNFTs={hideNFTs}
            cancelOrderClick={cancelOrderClick}
            transferNFTClick={transferNFTClick}
            nftBalances={nftBalances}
            revealNFTs={revealNFTs}
            serverNftBalances={serverNftBalances}
          />
        </div>
      </div>
    </Layout>
  );
};

export default MyNFTsWrapper;
