import React, { useState, useEffect, useCallback } from "react";
import Spinner from "react-bootstrap/Spinner";
import Button from "react-bootstrap/Button";
import useSWR from "swr";
import { useWallet } from "use-wallet";
import NFTListItem from "../../components/NFTListItem";
import Layout from "../../components/Layout";
import { useRouter } from "next/router";
import { modelSetBundles } from "../../treat/lib/constants";
import useGetTreatSetCost from "../../hooks/useGetTreatSetCost";
import useRedeemSet from "../../hooks/useRedeemSet";
import { getDisplayBalance } from "../../utils/formatBalance";
import { motion } from "framer-motion";

const ViewModelWrapper = ({ username }) => {
  const { data: res } = useSWR(`/api/model/${username}`);
  const [modelData, setModelData] = useState();
  const [modelNFTs, setModelNFTs] = useState();
  const [newNFTs, setNewNFTs] = useState([]);
  const [outOfPrintNFTs, setOutOfPrintNFTs] = useState([]);
  const { status } = useWallet();
  const router = useRouter();

  useEffect(() => {
    (async () => {
      if (res) {
        setModelData(res);

        if (!res.nfts || res.nfts.length === 0) return setModelNFTs([]);

        const mNfts = await Promise.all(
          res.nfts.map(async (nft) => {
            const x = await fetch(`/api/nft/${nft.id}`);
            const j = await x.json();
            console.log({ j });
            return j;
          })
        );

        let newNFTs = mNfts.filter((nft) => nft.maxSupply > nft.totalSupply);
        let outOfPrint = mNfts.filter(
          (nft) => nft.maxSupply === nft.totalSupply
        );

        setModelNFTs(mNfts);
        setNewNFTs(newNFTs);
        setOutOfPrintNFTs(outOfPrint);
      }
    })();
  }, [res]);

  const setId = modelSetBundles[username];
  const nftSetPrice = useGetTreatSetCost(setId);
  const { onRedeemSet } = setId
    ? useRedeemSet(setId, nftSetPrice)
    : { onRedeemSet: null };

  console.log({ setId, nftSetPrice });

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
      <Layout>
        <ViewModel
          modelData={modelData}
          modelNFTs={modelNFTs}
          newNFTs={newNFTs}
          outOfPrintNFTs={outOfPrintNFTs}
          nftSetPrice={nftSetPrice}
          onRedeemSet={onRedeemSet}
        />
      </Layout>
    );
  }
};

const ViewModel = ({
  modelData,
  modelNFTs,
  newNFTs,
  outOfPrintNFTs,
  nftSetPrice,
  onRedeemSet,
}) => {
  const [selectedTab, setSelectedTab] = useState("NEW NFTs");
  const [otherTab, setOtherTab] = useState("OUT OF PRINT");

  const switchTab = () => {
    const current = selectedTab;
    const other = otherTab;
    setSelectedTab(other);
    setOtherTab(current);
  };

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

          <a href="/creators">
            <Button style={{ marginTop: 15, width: "100%" }}>
              View all Models
            </Button>
          </a>
        </div>
        <div className="col-lg-9 text-container container mt-4 mt-lg-0">
          {!!onRedeemSet && (
            <div
              style={{
                backgroundColor: "rgba(255,255,255,0.75)",
                marginBottom: "25px",
                display: "flex",
                justifyContent: "center",
                paddingTop: "2%",
                paddingBottom: "2%",
                borderRadius: "8px",
              }}
            >
              <Button onClick={onRedeemSet} size="lg">
                Redeem full set for {getDisplayBalance(nftSetPrice)} BNB
              </Button>
            </div>
          )}

          {/* <div row>
            <Button
              onClick={() => {
                switchTab();
              }}
              disabled={selectedTab === "NEW NFTs"}
            >
              NEW LISTINGS
            </Button>
            <Button
              onClick={() => {
                switchTab();
              }}
              disabled={selectedTab === "OUT OF PRINT"}
            >
              OUT OF PRINT
            </Button>
          </div> */}

          <motion.div
            className="nft-list row mt-5"
            animate={modelNFTs && modelNFTs.length > 0 && "show"}
            exit="hidden"
            initial="hidden"
            variants={{
              show: { transition: { staggerChildren: 0.15 }, opacity: 1 },
              hidden: {
                transition: {
                  staggerChildren: 0.02,
                  staggerDirection: -1,
                  when: "afterChildren",
                },
              },
            }}
          >
            {modelNFTs &&
              modelNFTs.length > 0 &&
              modelNFTs
                .sort((a, b) => a.list_price - b.list_price)
                .map((m) => (
                  <div className="col-md-6">
                    <NFTListItem modelData={modelData} data={m} key={m.id} />
                  </div>
                ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

ViewModelWrapper.getInitialProps = async ({ query: { username } }) => {
  return { username };
};

export default ViewModelWrapper;
