/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";

import Axios from "axios";
import BigNumber from "bignumber.js";
import BlankModal from "../components/BlankModal";
import { Button } from "react-bootstrap";
import CancelOrderModal from "../components/CancelOrderModal";
import ErrorFallback from "../components/Fallback/Error";
import Hero from "../components/Hero";
import Layout from "../components/Layout";
import LazyLoad from "react-lazyload";
import ListOrderModal from "../components/ListOrderModal";
import MyNFTItem from "../components/MyNFTItem";
import MyNFTItemSkeleton from "../components/Skeleton/MyNFTItemSkeleton";
import PaginationComponentV2 from "../components/Pagination";
import Spinner from "react-bootstrap/Spinner";
import TransferNFTModal from "../components/TransferNFTModal";
import { enforceAuth } from "../lib/server/getServerSideProps";
import { getDisplayBalance } from "../utils/formatBalance";
import { useMoralis } from "react-moralis";

const OwnedNfts = ({
  hideNFTs,
  revealNFTs,
  ownedNFTData,
  transferNFTClick,
  listOrderClick,
  isLoading,
  signature,
  navigate,
  error,
}) => {
  if (error) {
    return <ErrorFallback custom="Failed to load my NFT's" />;
  }
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
          {ownedNFTData.docs.length > 0 && (
            <div className="button-container">
              {signature ? (
                <Button variant="secondary  w-sm-100" onClick={hideNFTs}>
                  <b>{"Hide Contents 🙈"}</b>
                </Button>
              ) : (
                <Button variant="primary w-100" onClick={revealNFTs}>
                  <b>{"Reveal Contents 👀"}</b>
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
      {ownedNFTData.docs.length && !isLoading > 0 ? (
        <div className="">
          <div
            className="d-flex text-left justify-content-center mt-5 w-100 flex-wrap"
            animate="show"
            exit="hidden"
            initial="hidden"
          >
            {ownedNFTData.docs.map((nft) => (
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
          {ownedNFTData.docs.length > 0 && (
            <div className="flex justify-center py-2">
              <PaginationComponentV2
                hasNextPage={ownedNFTData.hasNextPage}
                hasPrevPage={ownedNFTData.hasPrevPage}
                totalPages={ownedNFTData.totalPages}
                totalDocs={ownedNFTData.totalDocs}
                page={ownedNFTData.page}
                goNext={() => navigate("owned", Number(ownedNFTData.page) + 1)}
                goPrev={() => navigate("owned", Number(ownedNFTData.page) - 1)}
                loading={isLoading}
                setPage={(page) => navigate("owned", Number(page))}
              />
            </div>
          )}
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
      ) : error ? (
        <div>{JSON.stringify(error)}</div>
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
  resaleNFTData,
  cancelOrderClick,
  signature,
  isLoading,
  navigate,
  error,
}) => {
  if (error) {
    return <ErrorFallback custom="Failed to load Resale NFT's" />;
  }
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
          {resaleNFTData.docs.length > 0 && (
            <div className="button-container">
              {signature ? (
                <Button variant="secondary  w-sm-100" onClick={hideNFTs}>
                  <b>{"Hide Contents 🙈"}</b>
                </Button>
              ) : (
                <Button variant="primary w-100" onClick={revealNFTs}>
                  <b>{"Reveal Contents 👀"}</b>
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
      {resaleNFTData.docs.length > 0 && !isLoading ? (
        <div className="container px-4 ">
          <div className="d-flex text-left mt-5">
            <div
              className="d-flex text-left mt-5 w-100 flex-wrap justify-content-center"
              animate="show"
              exit="hidden"
              initial="hidden"
            >
              {resaleNFTData.docs.map((nft) => {
                return (
                  <LazyLoad key={nft.id} height={400} offset={600}>
                    <div className="order-container">
                      <MyNFTItem
                        price={
                          nft &&
                          nft.price &&
                          getDisplayBalance(new BigNumber(nft.price))
                        }
                        balance={nft.quantity}
                        data={nft}
                        isLoading={isLoading}
                        revealNFTs={revealNFTs}
                        cancelOrderClick={cancelOrderClick}
                      />
                    </div>
                  </LazyLoad>
                );
              })}
            </div>
          </div>
          {resaleNFTData.docs.length > 0 && (
            <div className="flex justify-center py-2">
              <PaginationComponentV2
                hasNextPage={resaleNFTData.hasNextPage}
                hasPrevPage={resaleNFTData.hasPrevPage}
                totalPages={resaleNFTData.totalPages}
                totalDocs={resaleNFTData.totalDocs}
                page={resaleNFTData.page}
                goNext={() =>
                  navigate("resale", Number(resaleNFTData.page) + 1)
                }
                goPrev={() =>
                  navigate("resale", Number(resaleNFTData.page) - 1)
                }
                loading={isLoading}
                setPage={(page) => navigate("resale", Number(page))}
              />
            </div>
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
      ) : error ? (
        <div>{JSON.stringify(error)}</div>
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
          You haven&#39;t listed any NFTs for resale yet.
        </div>
      )}
    </div>
  );
};

const ViewNFT = ({
  account,
  resaleNFTData,
  ownedNFTData,
  isOpenOrdersLoading,
  isOwnedLoading,
  ownedNFTDataError,
  resaleNFTDataError,
  navigate,
  hideNFTs,
  revealNFTs,
  signature,
}) => {
  const [transferNFTData, setTransferNFTData] = useState(null);
  const [listOrderData, setListOrderData] = useState(null);
  const [cancelOrderData, setCancelOrderData] = useState(null);
  const [showPendingModal, setShowPendingModal] = useState(null);
  const [showCompleteModal, setShowCompleteModal] = useState(null);

  // TODO: We want to fetch only NFTs with balance from the server and paginate those

  const transferNFTClick = (x) => {
    setTransferNFTData(x);
  };

  const listOrderClick = (x) => {
    setListOrderData(x);
  };

  const cancelOrderClick = (x) => {
    setCancelOrderData(x);
  };

  /*
  const v1NFTs = nftBalancesInitial.filter((a) => a.balanceV1Number > 0);

  if (v1NFTs.length > 0) {
    return <TradeInNFTs v1NFTs={v1NFTs} account={account} />;
  }
  */

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
            ownedNFTData={ownedNFTData}
            revealNFTs={revealNFTs}
            isLoading={isOwnedLoading}
            signature={signature}
            navigate={navigate}
            error={ownedNFTDataError}
          />
        </div>
        <div className="mt-2">
          <OpenOrders
            hideNFTs={hideNFTs}
            cancelOrderClick={cancelOrderClick}
            transferNFTClick={transferNFTClick}
            resaleNFTData={resaleNFTData}
            revealNFTs={resaleNFTData}
            isLoading={isOpenOrdersLoading}
            signature={signature}
            navigate={navigate}
            error={resaleNFTDataError}
          />
        </div>
      </div>
    </Layout>
  );
};

const MyNFTsWrapper = () => {
  const { isAuthenticated, account, web3 } = useMoralis();
  const [ownedNFTData, setOwnedNFTData] = useState({
    docs: [],
    hasNextPage: false,
    hasPrevPage: false,
    totalPages: 1,
    totalDocs: 0,
    page: 1,
    loading: true,
  });
  const [resaleNFTData, setResaleNFTData] = useState({
    docs: [],
    hasNextPage: false,
    hasPrevPage: false,
    totalPages: 1,
    totalDocs: 0,
    page: 1,
    loading: true,
  });
  const [ownedNFTError, setOwnedNFTError] = useState(null);
  const [resaleNFTError, setResaleNFTError] = useState(null);
  const [signature, setSignature] = useState(null);

  const hideNFTs = async () => {
    setSignature(null);
  };

  const revealNFTs = async () => {
    if (account) {
      const signer = web3.getSigner();
      const signature = await signer.signMessage("Reveal Contents");
      setSignature(signature);
    }
  };

  useEffect(() => {
    setOwnedNFTData({ ...ownedNFTData, loading: true });
    setResaleNFTData({ ...resaleNFTData, loading: true });
    if (isAuthenticated) {
      Axios.post(`/api/v2/nft/my_nfts?page=${ownedNFTData.page}`, { signature })
        .then((res) => {
          setOwnedNFTData({ ...res.data, loading: false });
        })
        .catch((err) => {
          console.error(err);
          setOwnedNFTError(err);
          setOwnedNFTData({ ...ownedNFTData, loading: false });
        });

      Axios.post(`/api/v2/nft/my_resale_nfts?page=${resaleNFTData.page}`, {
        signature,
      })
        .then((res) => {
          setResaleNFTData({ ...res.data, loading: false });
        })
        .catch((err) => {
          console.error(err);
          setResaleNFTError(err);
          setResaleNFTData({ ...resaleNFTData, loading: false });
        });
    }
  }, [isAuthenticated, signature]);

  const navigate = (key, page) => {
    if (key === "owned") {
      setOwnedNFTData({ ...ownedNFTData, loading: true, page });
      Axios.post(`/api/v2/nft/my_nfts?page=${page}`, { signature })
        .then((res) => {
          setOwnedNFTData({ ...res.data, loading: false });
        })
        .catch((err) => {
          console.error(err);
          setOwnedNFTData({ ...ownedNFTData, loading: false });
          setOwnedNFTError(err);
        });
    } else {
      setResaleNFTData({ ...resaleNFTData, loading: true, page });
      Axios.post(`/api/v2/nft/my_resale_nfts?page=${page}`, { signature })
        .then((res) => {
          setResaleNFTData({ ...res.data, loading: false });
        })
        .catch((err) => {
          console.error(err);
          setOwnedNFTData({ ...resaleNFTData, loading: false });
          setResaleNFTError(err);
        });
    }
  };

  if (!isAuthenticated) {
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
        navigate={navigate}
        isOwnedLoading={ownedNFTData.loading}
        isOpenOrdersLoading={resaleNFTData.loading}
        ownedNFTData={ownedNFTData}
        resaleNFTData={resaleNFTData}
        resaleNFTDataError={resaleNFTError}
        ownedNFTDataError={ownedNFTError}
        hideNFTs={hideNFTs}
        revealNFTs={revealNFTs}
        signature={signature}
      />
    );
  }
};

export const getServerSideProps = async (ctx) => enforceAuth(ctx);

export default MyNFTsWrapper;
