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
      <div className="white-tp-bg mt-4 p-3 pb -1">
        <p className="w-100 mb-0" style={{ wordBreak: "break-word" }}>
          <b>Connected wallet address:</b>
          <div>{`${account}`}</div>
        </p>
      </div>
      <div className="mt-2">
        <div className="white-tp-bg p-4">
          <h2 className=" pb-4 w-100 text-center">
            <div className="heading-text-red mb-2" style={{ fontSize: 36 }}>
              My NFTs
            </div>
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
          </h2>
          {nftBalances ? (
            <div className="row d-flex flex-wrap text-left justify-content-center">
              {nftBalances.map((nft) => {
                return (
                  <div className="col-xl-3 col-md-6 px-4">
                    <MyNFTItem data={nft} />
                  </div>
                );
              })}
            </div>
          ) : (
            <div>You haven't got any NFTs yet.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyNFTsWrapper;
