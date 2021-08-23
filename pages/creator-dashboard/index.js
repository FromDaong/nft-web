import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Spinner from "react-bootstrap/Spinner";
import CreatorNFTItem from "../../components/CreatorNFTItem";
import TradeInNFTs from "../../components/TradeInNFTs";
import Hero from "../../components/Hero";
import Button from "react-bootstrap/Button";
import useGetNftMaxSupply from "../../hooks/useGetNftMaxSupply";
import useGetNftBalance from "../../hooks/useGetNftBalance";
import { getDisplayBalance } from "../../utils/formatBalance";
import useGetOpenOrdersForSeller from "../../hooks/useGetOpenOrdersForSeller";
import useWallet from "use-wallet";
import useSWR from "swr";
import Link from "next/link";
import Layout from "../../components/Layout";
import { PlusLg } from "react-bootstrap-icons";

const variants = {
  show: {
    transition: { staggerChildren: 0.25 },
    when: "afterChildren",
    opacity: 1,
  },
  hidden: {
    transition: {
      staggerChildren: 0.02,
      staggerDirection: -1,
      when: "afterChildren",
    },
  },
};

const CreatorDashboardWrapper = ({ modelData }) => {
  const { account, status } = useWallet();

  if (status !== "connected" || !modelData) {
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
    return (
      <ViewNFT
        account={account}
        nftArray={modelData.nfts}
        modelData={modelData}
      />
    );
  }
};

const ViewNFT = ({ modelData, account }) => {
  const [serverNftBalances, setServerNftBalances] = useState(null);

  const maxNftSupply = useGetNftMaxSupply(account);
  const [isLoading, setIsLoading] = useState(false);

  const { data: nftData } = useSWR(`/api/model/nfts-from-address/${account}`);

  const transferNFTClick = (x) => {
    setTransferNFTData(x);
  };

  const hideNFTs = async () => {
    setServerNftBalances(null);
  };

  return (
    <Layout>
      <div className="container  my-nft-container">
        <motion.div
          animate={{ y: 0, opacity: 1 }}
          style={{ y: -100, opacity: 0 }}
          transition={{ delay: 0.25 }}
          className="pink-bg mb-5 row mt-5"
        >
          <div className="col-md-3">
            <div className="d-flex justify-content-center h-100">
              <div
                style={{
                  height: 150,
                  width: 150,
                  backgroundImage: `url(${
                    modelData ? modelData.profile_pic : null
                  })`,
                  backgroundSize: "cover",
                  borderRadius: 8,
                }}
              ></div>
            </div>
            {/* <img src={modelData && modelData.profile_pic} /> */}
          </div>
          <div className="col-md-9">
            <div className="d-flex flex-column justify-content-center h-100 text-md-left text-center">
              <div
                className="heading-text p-0"
                style={{ fontSize: "3.5em", lineHeight: 1.2 }}
              >
                {modelData && modelData.username}'s Dashboard
              </div>
              <p
                className="totw-secondary-text m-0 mt-2 pb-3"
                style={{ maxWidth: "none" }}
              >
                Connected wallet address: {account}
              </p>

              <div>
                <Link
                  href="/creator-dashboard/create-nft
                "
                >
                  <Button variant="primary  w-100" style={{ maxWidth: 250 }}>
                    <b>{"CREATE NEW NFTs"}</b>
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
        <div className="mt-2">
          <CreatedNFTs
            hideNFTs={hideNFTs}
            transferNFTClick={transferNFTClick}
            isLoading={isLoading}
            nftData={nftData}
            modelData={modelData}
          />
        </div>
      </div>
    </Layout>
  );
};

const CreatedNFTs = ({
  transferNFTClick,
  listOrderClick,
  isLoading,
  nftData,
  modelData,
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
            Created NFTs
          </h2>
        </div>
      </div>
      {nftData && nftData.nfts.length > 0 ? (
        <div className="container">
          <div className="d-flex text-left justify-content-center mt-5">
            <motion.div
              className="row w-100"
              animate="show"
              exit="hidden"
              initial="hidden"
              variants={variants}
            >
              {nftData.nfts.map((nft) => {
                console.log({ nft });
                return (
                  nft && (
                    <div className="col-md-4 bg-transparent border-0">
                      <CreatorNFTItem
                        balance={nft.balance}
                        isLoading={isLoading}
                        data={nft}
                        price={nft.list_price}
                        transferNFTClick={transferNFTClick}
                        listOrderClick={listOrderClick}
                        modelData={modelData}
                        hasOpenOrder={nft.hasOpenOrder}
                      />
                    </div>
                  )
                );
              })}
            </motion.div>
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
          You haven't created any NFTs yet
        </div>
      )}
    </div>
  );
};
export default CreatorDashboardWrapper;
