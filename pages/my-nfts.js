import React, { useState, useEffect } from "react";
import Spinner from "react-bootstrap/Spinner";
import Nav from "react-bootstrap/Nav";
import MyNFTItem from "../components/MyNFTItem";
import Button from "react-bootstrap/Button";
import useGetNftMaxSupply from "../hooks/useGetNftMaxSupply";
import useGetNftBalance from "../hooks/useGetNftBalance";
import useGetNftTotalSupply from "../hooks/useGetNftTotalSupply";
import useWallet from "use-wallet";
import useSWR from "swr";

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

const ViewNFT = ({ account, nftArray }) => {
  const [serverNftBalances, setServerNftBalances] = useState(null);

  const maxNftSupply = useGetNftMaxSupply(account);
  const nftBalancesInitial = useGetNftBalance(nftArray);

  const nftBalances = serverNftBalances || nftBalancesInitial;

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
    <div className="container  my-nft-container">
      <div className="white-tp-bg mt-4 p-3">
        <p className="w-100 mb-0" style={{ wordBreak: "break-word" }}>
          <b>Connected wallet address:</b>
          <div>{`${account}`}</div>
        </p>
      </div>
      <div className="mt-2">
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
                    <div className="col-xl-4 col-md-6 px-4">
                      <MyNFTItem data={nft} revealNFTs={revealNFTs} />
                    </div>
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
      </div>
    </div>
  );
};

export default MyNFTsWrapper;
