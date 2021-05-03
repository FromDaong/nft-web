import React, { useState, useEffect } from "react";
import Spinner from "react-bootstrap/Spinner";
import Button from "react-bootstrap/Button";
import useSWR from "swr";
import useWallet from "use-wallet";
import NFTListItem from "../../components/NFTListItem";
import { useRouter } from "next/router";
import { modelSetBundles } from "../../treat/lib/constants";
import useGetTreatSetCost from "../../hooks/useGetTreatSetCost";
import useRedeemSet from "../../hooks/useRedeemSet";
import { getDisplayBalance } from "../../utils/formatBalance";

const ViewModelWrapper = ({ username }) => {
  const { data: res } = useSWR(`/api/model/${username}`);
  const [modelData, setModelData] = useState();
  const [modelNFTs, setModelNFTs] = useState();
  const { status } = useWallet();
  const router = useRouter();

  useEffect(() => {
    (async () => {
      console.log({ res });
      if (res) {
        setModelData(res);

        if (!res.nfts || res.nfts.length === 0) return setModelNFTs([]);

        const mNfts = await Promise.all(
          res.nfts.map(async (nft) => {
            const x = await fetch(`/api/nft/${nft.id}`);
            const j = await x.json();
            return j;
          })
        );

        setModelNFTs(mNfts);
      }
    })();
  }, [res]);

  const setId = modelSetBundles[username];
  const nftSetPrice = useGetTreatSetCost(setId);
  const { onRedeemSet } = setId
    ? useRedeemSet(setId, nftSetPrice)
    : { onRedeemSet: null };

  if (!modelData || !modelData.username || status !== "connected") {
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
          Please make sure your Binance Smart Chain wallet is connected.
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
    return (
      <ViewModel
        modelData={modelData}
        modelNFTs={modelNFTs}
        nftSetPrice={nftSetPrice}
        onRedeemSet={onRedeemSet}
      />
    );
  }
};

const ViewModel = ({ modelData, modelNFTs, nftSetPrice, onRedeemSet }) => {
  console.log({ modelNFTs });
  return (
    <div className="container">
      <div className="view-model row">
        <div className="image-wrapper col-lg-3 p-0 pr-lg-3">
          <div className="image-container text-center text-lg-left">
            <img src={modelData.profile_pic} className="profile-pic" />
            <div className="title mt-3">{modelData.username}</div>
            <div
              className="bio text-center mt-2"
              style={{ fontSize: ".9em", color: "#777" }}
            >
              {modelData.bio}
            </div>
          </div>
        </div>
        {/* {!!onRedeemSet && (
          <div className="col-lg-9 text-container container mt-4 mt-lg-0">
              <Button onClick={onRedeemSet}>Redeem full set for {getDisplayBalance(nftSetPrice)}</Button>
          </div>
        )} */}
        <div className="col-lg-9 text-container container mt-4 mt-lg-0">
        {
          !!onRedeemSet && (
          <div
            style={{
              backgroundColor: "rgba(255,255,255,0.75)",
              marginBottom: "25px",
              display: "flex",
              justifyContent: "center",
              paddingTop: "2%",
              paddingBottom: "2%",
              borderRadius: '8px',
            }}
          >
            <Button onClick={onRedeemSet} size="lg">
              Redeem full set for {getDisplayBalance(nftSetPrice)} BNB
            </Button>
          </div>
        )}
          {modelNFTs &&
            modelNFTs
              .sort((a, b) => a.list_price - b.list_price)
              .map((m) => <NFTListItem data={m} key={m.id} />)}
        </div>
      </div>
    </div>
  );
};

ViewModelWrapper.getInitialProps = async ({ query: { username } }) => {
  return { username };
};

export default ViewModelWrapper;
