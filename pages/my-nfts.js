/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
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
import PaginationComponentV2 from "../components/Pagination";
import { useRouter } from "next/router";

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
  isLoading,
  signature,
}) => {
  const { status, account } = useWallet();
  const [loading, setLoading] = useState(true);
  const [doneInitialFetch, setDoneInitialFetch] = useState(false);

  const [nftData, setNFTData] = useState({
    docs: [],
    hasNextPage: false,
    hasPrevPage: false,
    totalPages: 1,
    totalDocs: 0,
    page: 1,
  });

  const nftWithBalances = nftBalances.filter((i) => !i.hasOpenOrder);
  const router = useRouter();

  const fetchNFTS = async (page) => {
    setLoading(true);
    axios
      .post("/api/v2/nft/getWithBalances", {
        nfts: nftWithBalances,
        account: account,
        page: router.query.owned_nfts_page ?? 1,
        signature,
      })
      .then((resp) => {
        setNFTData(resp.data);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };

  useEffect(() => {
    if (
      status === "connected" &&
      nftWithBalances &&
      nftWithBalances?.length > 0 &&
      !doneInitialFetch &&
      !isLoading
    ) {
      fetchNFTS(nftData.page).then(() => setDoneInitialFetch(true));
    }
  }, [status, account, nftWithBalances, isLoading]);

  useEffect(() => {
    fetchNFTS(nftData.page);
  }, [signature]);

  useEffect(() => {
    if (router.query.owned_nfts_page && nftWithBalances.length > 0) {
      fetchNFTS(nftData.owned_nfts_page);
    }
  }, [router, nftWithBalances]);

  const navigate = (page) => {
    router.push(`${router.pathname}?owned_nfts_page=${page}`, undefined, {
      shallow: true,
    });
  };

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
          {nftData.docs.length > 0 && (
            <div className="button-container">
              {signature ? (
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
      {nftData.docs.length > 0 ? (
        <div className="">
          <div
            className="d-flex text-left justify-content-center mt-5 w-100 flex-wrap"
            animate="show"
            exit="hidden"
            initial="hidden"
            variants={variants}
          >
            {nftData.docs.map((nft) => (
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
          {nftData.docs.length > 0 && (
            <div className="flex justify-center py-2">
              <PaginationComponentV2
                hasNextPage={nftData.hasNextPage}
                hasPrevPage={nftData.hasPrevPage}
                totalPages={nftData.totalPages}
                totalDocs={nftData.totalDocs}
                page={nftData.page}
                goNext={() => navigate(Number(nftData.page) + 1)}
                goPrev={() => navigate(Number(nftData.page) - 1)}
                loading={loading}
                setPage={(page) => navigate(Number(page))}
              />
            </div>
          )}
        </div>
      ) : loading || isLoading ? (
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
  cancelOrderClick,
  signature,
  isLoading,
}) => {
  const { status, account } = useWallet();
  const [loading, setLoading] = useState(true);
  const [doneInitialFetch, setDoneInitialFetch] = useState(false);
  const [nftData, setNFTData] = useState({
    docs: [],
    hasNextPage: false,
    hasPrevPage: false,
    totalPages: 1,
    totalDocs: 0,
    page: 1,
  });

  const openOrders = useGetOpenOrdersForSeller() ?? [];
  const nftWithOpenOrders = nftBalances.filter((i) => i.hasOpenOrder);
  const router = useRouter();

  const fetchNFTS = async () => {
    setLoading(true);
    axios
      .post("/api/v2/nft/getWithBalances", {
        nfts: nftWithOpenOrders,
        account: account,
        page: router.query.open_orders_page ?? 1,
        signature,
      })
      .then((resp) => {
        setNFTData(resp.data);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };

  useEffect(() => {
    if (
      status === "connected" &&
      nftWithOpenOrders &&
      nftWithOpenOrders?.length > 0 &&
      !doneInitialFetch
    ) {
      console.log({ nftWithOpenOrders });
      fetchNFTS(nftData.page).then(() => setDoneInitialFetch(true));
    }
  }, [status, account, nftWithOpenOrders]);

  useEffect(() => {
    fetchNFTS(nftData.page);
  }, [signature]);

  useEffect(() => {
    if (router.query.open_orders_page) {
      fetchNFTS(nftData.open_orders_page);
    }
  }, [router]);

  const navigate = (page) => {
    router.push(`${router.pathname}?open_orders_page=${page}`, undefined, {
      shallow: true,
    });
  };

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
          {nftData.docs > 0 && openOrders.length > 0 && (
            <div className="button-container">
              {signature ? (
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
      {nftData.docs > 0 && openOrders.length > 0 ? (
        <div className="container px-4 ">
          <div className="d-flex text-left mt-5">
            <div
              className="d-flex text-left mt-5 w-100 flex-wrap justify-content-center"
              animate="show"
              exit="hidden"
              initial="hidden"
              variants={variants}
            >
              {nftData.docs.map((nft) => {
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
          {nftData.docs.length > 0 && (
            <PaginationComponentV2
              hasNextPage={nftData.hasNextPage}
              hasPrevPage={nftData.hasPrevPage}
              totalPages={nftData.totalPages}
              totalDocs={nftData.totalDocs}
              page={nftData.page}
              goNext={() => navigate(Number(nftData.page) + 1)}
              goPrev={() => navigate(Number(nftData.page) - 1)}
              loading={loading}
              setPage={(page) => navigate(Number(page))}
            />
          )}
        </div>
      ) : loading ? (
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
  const [signature, setSignature] = useState(null);
  const { totalNftBalances: nftBalancesInitial, loading: isLoading } =
    useGetNftBalance(nftArray);

  const nftBalances = nftBalancesInitial;
  const [transferNFTData, setTransferNFTData] = useState(null);
  const [listOrderData, setListOrderData] = useState(null);
  const [cancelOrderData, setCancelOrderData] = useState(null);
  const [showPendingModal, setShowPendingModal] = useState(null);
  const [showCompleteModal, setShowCompleteModal] = useState(null);

  // TODO: We want to fetch only NFTs with balance from the server and paginate those

  console.log({ nftBalances, nftArray, isLoading });

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
    setSignature(null);
  };

  const revealNFTs = async () => {
    if (account && treat) {
      const signature = await treat.signMessage(account, "Reveal Contents");
      setSignature(signature);
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
            signature={signature}
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
            signature={signature}
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
