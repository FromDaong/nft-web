import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Spinner from "react-bootstrap/Spinner";
import MyNFTItem from "../components/MyNFTItem";
import TransferNFTModal from "../components/TransferNFTModal";
import ListOrderModal from "../components/ListOrderModal";
import BlankModal from "../components/BlankModal";
import TradeInNFTs from "../components/TradeInNFTs";
import CancelOrderModal from "../components/CancelOrderModal";
import Hero from "../components/Hero";
import Button from "react-bootstrap/Button";
import useGetNftMaxSupply from "../hooks/useGetNftMaxSupply";
import useGetNftBalance from "../hooks/useGetNftBalance";
import { getDisplayBalance } from "../utils/formatBalance";
import useGetOpenOrdersForSeller from "../hooks/useGetOpenOrdersForSeller";
import { useWallet } from "use-wallet";
import axios from "axios";
import BigNumber from "bignumber.js";
import LazyLoad from "react-lazyload";
import Layout from "../components/Layout";
import ErrorFallback from "../components/Fallback/Error";
import { usePagination } from "react-use-pagination";
import PaginationComponent from "../components/PaginationComponent";
import MyNFTItemSkeleton from "../components/Skeleton/MyNFTItemSkeleton";

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

const OwnedNfts = ({
  hideNFTs,
  revealNFTs,
  nftBalances,
  transferNFTClick,
  listOrderClick,
  serverNftBalances,
  isLoading,
}) => {
  const [currentNFTs, setCurrentNFTs] = useState([]);

  const nftWithBalances = nftBalances.filter((i) => !i.hasOpenOrder);
  const {
    currentPage,
    totalPages,
    setPage,
    setPageSize,
    setNextPage,
    setPreviousPage,
    startIndex,
    endIndex,
  } = usePagination({
    totalItems: nftWithBalances ? nftWithBalances.length + 1 : 0,
    initialPageSize: 12,
  });

  useEffect(() => {
    if (serverNftBalances) {
      const current = serverNftBalances.slice(
        startIndex > 0 ? startIndex - 1 : startIndex,
        startIndex > 0 ? endIndex : endIndex + 1
      );
      setCurrentNFTs(current);
    } else {
      const current = nftWithBalances.slice(
        startIndex,
        startIndex > 0 ? endIndex : endIndex + 1
      );
      setCurrentNFTs(current);
    }
  }, [startIndex, endIndex, nftWithBalances, serverNftBalances]);

  return (
    <div className="full-width white-tp-bg" style={{ minHeight: 400 }}>
      <div
        className="px-4 py-2 w-100"
        style={{
          background: "#FFFDF2",
        }}
      >
        <div
          className="container d-flex"
          style={{
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
              My NFTs
            </h2>
          </div>
          {nftWithBalances.length > 0 && (
            <div className="button-container">
              {serverNftBalances ? (
                <Button variant="secondary  w-sm-100" onClick={hideNFTs}>
                  <b>{"Hide Contents 🙈"}</b>
                </Button>
              ) : (
                <Button variant="primary  w-sm-100" onClick={revealNFTs}>
                  <b>{"Reveal Contents 👀"}</b>
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
      {nftWithBalances.length > 0 ? (
        <div className="">
          <div
            className="d-flex text-left justify-content-center mt-5 w-100 flex-wrap"
            animate="show"
            exit="hidden"
            initial="hidden"
            variants={variants}
          >
            {currentNFTs.map((nft) => (
              <LazyLoad key={nft.id} height={400} offset={600}>
                <div className="order-container">
                  <MyNFTItem
                    balance={nft.balance}
                    isLoading={isLoading}
                    data={nft}
                    revealNFTs={revealNFTs}
                    transferNFTClick={transferNFTClick}
                    listOrderClick={listOrderClick}
                    hasOpenOrder={nft.hasOpenOrder}
                  />
                </div>
              </LazyLoad>
            ))}
          </div>
          <PaginationComponent
            currentPage={currentPage}
            totalPages={totalPages}
            setPage={setPage}
            setPageSize={setPageSize}
            setNextPage={setNextPage}
            setPreviousPage={setPreviousPage}
            fixedPageSize
          />
        </div>
      ) : isLoading ? (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
          className="full-width"
        >
          {new Array(12).fill(0).map((_, i) => (
            <MyNFTItemSkeleton key={i} className="col-span-1" />
          ))}
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
          You do not own any NFTs at the moment.
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
  isLoading,
}) => {
  const openOrders = useGetOpenOrdersForSeller() ?? [];
  const nftWithOpenOrders = nftBalances.filter((i) => i.hasOpenOrder);
  const {
    currentPage,
    totalPages,
    setPage,
    setPageSize,
    setNextPage,
    setPreviousPage,
    startIndex,
    endIndex,
  } = usePagination({
    totalItems: nftWithOpenOrders.length > 0 ? nftWithOpenOrders.length + 1 : 0,
    initialPageSize: 12,
  });

  return (
    <div className="full-width white-tp-bg" style={{ minHeight: 400 }}>
      <div style={{ background: "#FFFDF2" }}>
        <div
          className="px-4 py-2 w-100 container d-flex"
          style={{
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
              Listed on Re-Sale Marketplace
            </h2>
          </div>
          {nftBalances.length > 0 && openOrders.length > 0 && (
            <div className="button-container">
              {serverNftBalances ? (
                <Button variant="secondary  w-sm-100" onClick={hideNFTs}>
                  <b>{"Hide Contents 🙈"}</b>
                </Button>
              ) : (
                <Button variant="primary  w-sm-100" onClick={revealNFTs}>
                  <b>{"Reveal Contents 👀"}</b>
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
      {nftWithOpenOrders.length > 0 && openOrders.length > 0 ? (
        <div className="container px-4 ">
          <div className="d-flex text-left mt-5">
            <div
              className="d-flex text-left mt-5 w-100 flex-wrap justify-content-center"
              animate="show"
              exit="hidden"
              initial="hidden"
              variants={variants}
            >
              {nftWithOpenOrders
                .slice(startIndex > 0 ? startIndex - 1 : startIndex, endIndex)
                .map((nft) => {
                  if (nft.hasOpenOrder) {
                    const order = openOrders.find(
                      (i) => Number(i.nftId) === nft.id
                    );

                    return (
                      <LazyLoad height={400} offset={600}>
                        <div className="order-container">
                          <MyNFTItem
                            price={
                              order &&
                              order.price &&
                              getDisplayBalance(new BigNumber(order.price))
                            }
                            balance={order?.quantity}
                            data={nft}
                            isLoading={isLoading}
                            revealNFTs={revealNFTs}
                            cancelOrderClick={cancelOrderClick}
                          />
                        </div>
                      </LazyLoad>
                    );
                  }
                })}
            </div>
          </div>
          {nftWithOpenOrders.length > 0 && (
            <PaginationComponent
              currentPage={currentPage}
              totalPages={totalPages}
              setPage={setPage}
              setPageSize={setPageSize}
              setNextPage={setNextPage}
              setPreviousPage={setPreviousPage}
              fixedPageSize
            />
          )}
        </div>
      ) : isLoading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 w-full container mx-auto"
        >
          {new Array(12).fill(0).map((_, i) => (
            <MyNFTItemSkeleton key={i} className="col-span-1" />
          ))}
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
          You haven't listed any NFTs for resale yet.
        </div>
      )}
    </div>
  );
};

const ViewNFT = ({ account, nftArray }) => {
  const [serverNftBalances, setServerNftBalances] = useState(null);

  const { totalNftBalances: nftBalancesInitial, loading: isLoading } =
    useGetNftBalance(nftArray);

  const nftBalances = serverNftBalances ?? nftBalancesInitial;
  const [transferNFTData, setTransferNFTData] = useState(null);
  const [listOrderData, setListOrderData] = useState(null);
  const [cancelOrderData, setCancelOrderData] = useState(null);
  const [showPendingModal, setShowPendingModal] = useState(null);
  const [showCompleteModal, setShowCompleteModal] = useState(null);

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

      const nftIds = nftBalances.map((n) => n.id);

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
        setServerNftBalances(resJSON.docs);
      }
    }
  };

  const v1NFTs = nftBalancesInitial.filter((a) => a.balanceV1Number > 0);

  if (v1NFTs.length > 0) {
    return <TradeInNFTs v1NFTs={v1NFTs} account={account} />;
  }

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
          setPendingModal={setShowPendingModal}
          openCompleteModal={() => setShowCompleteModal(true)}
        />
        <CancelOrderModal
          show={!!cancelOrderData}
          data={cancelOrderData}
          setPendingModal={setShowPendingModal}
          openCompleteModal={() => setShowCompleteModal(true)}
          handleClose={() => setCancelOrderData(false)}
          account={account}
        />
        <BlankModal
          show={!!showPendingModal}
          handleClose={() => setShowPendingModal(false)}
          title={"Waiting for Transaction Confirmation ⌛"}
          subtitle={
            "Please confirm this transaction in your wallet and wait here for up to a few minutes for the transaction to confirm..."
          }
          noButton={true}
          account={account}
        />
        <BlankModal
          show={!!showCompleteModal}
          handleClose={() => setShowCompleteModal(false)}
          account={account}
        />
        <Hero
          title={"My NFTs & Listings"}
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
            isLoading={isLoading}
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
            isLoading={isLoading}
            serverNftBalances={serverNftBalances}
          />
        </div>
      </div>
    </Layout>
  );
};

const MyNFTsWrapper = () => {
  const { account, status } = useWallet();
  const { error, setError } = useState();
  const [nftArray, setNftData] = useState({});

  useEffect(() => {
    axios
      .get("/api/nft?all=true")
      .then((resp) => {
        setNftData(resp.data);
      })
      .catch((err) => setError(err));
  }, []);

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
  } else if (error) {
    return <ErrorFallback custom="Failed to load my NFT's" />;
  } else {
    return <ViewNFT account={account} nftArray={nftArray} />;
  }
};

export default MyNFTsWrapper;
