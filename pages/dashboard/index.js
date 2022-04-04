import { Button, Spinner } from "react-bootstrap";
import { useEffect, useState } from "react";

import Axios from "axios";
import BlankModal from "../../components/BlankModal";
import CancelOrderModal from "../../components/CancelOrderModal";
import DashboardTabs from "../../components/CreatorDashboard/DashboardTabs";
import Layout from "../../components/Layout";
import Link from "next/link";
import ListOrderModal from "../../components/ListOrderModal";
import TransferNFTModal from "../../components/TransferNFTModal";
import { getModelData } from "../../lib/server/getServerSideProps";
import { useMoralis } from "react-moralis";
import useSWR from "swr";

const CreatorDashboardWrapper = ({ userInfo }) => {
  let modelData = JSON.parse(userInfo);
  const { account, isAuthenticated } = useMoralis();
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

  useEffect(() => {
    setOwnedNFTData({ ...ownedNFTData, loading: true });
    setResaleNFTData({ ...resaleNFTData, loading: true });
    if (isAuthenticated) {
      Axios.post(`/api/v2/nft/my_nfts?page=${ownedNFTData.page}`)
        .then((res) => {
          setOwnedNFTData({ ...res.data, loading: false });
        })
        .catch((err) => {
          console.error(err);
          setOwnedNFTError(err);
          setOwnedNFTData({ ...ownedNFTData, loading: false });
        });

      Axios.post(`/api/v2/nft/my_resale_nfts?page=${resaleNFTData.page}`)
        .then((res) => {
          setResaleNFTData({ ...res.data, loading: false });
        })
        .catch((err) => {
          console.error(err);
          setResaleNFTError(err);
          setResaleNFTData({ ...resaleNFTData, loading: false });
        });
    }
  }, [isAuthenticated]);

  const navigate = (key, page) => {
    if (key === "owned") {
      setOwnedNFTData({ ...ownedNFTData, loading: true, page });
      Axios.post(`/api/v2/nft/my_nfts?page=${page}`)
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
      Axios.post(`/api/v2/nft/my_resale_nfts?page=${page}`)
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

  const isModel = modelData && !modelData.pending && !modelData.rejected;

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
        nftArray={modelData.nfts}
        modelData={modelData}
        navigate={navigate}
        isOwnedLoading={ownedNFTData.loading}
        isOpenOrdersLoading={resaleNFTData.loading}
        ownedNFTData={ownedNFTData}
        resaleNFTData={resaleNFTData}
        resaleNFTDataError={resaleNFTError}
        ownedNFTDataError={ownedNFTError}
        isModel={isModel}
      />
    );
  }
};

const ViewNFT = ({
  modelData,
  account,
  resaleNFTData,
  ownedNFTData,
  isOpenOrdersLoading,
  isOwnedLoading,
  ownedNFTDataError,
  resaleNFTDataError,
  navigate,
  isModel,
}) => {
  const [isLoading, setIsLoading] = useState(false);
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

  const { data: nftData, error: nftError } = useSWR(
    `/api/model/nfts-from-address/${account}`
  );
  const { data: subNftData, error: subNftError } = useSWR(
    `/api/model/sub-nfts-from-address/${account}`
  );

  const hideNFTs = async () => {
    //setServerNftBalances(null);
  };

  return (
    <Layout>
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
      <div className="container  my-nft-container">
        <div className="pink-bg d-flex my-5 row justify-content-between">
          <div>
            <div
              className="heading-text p-0"
              style={{ fontSize: "3.5em", lineHeight: 1.2 }}
            >
              {modelData && modelData.username}&lsquo;s Dashboard
            </div>
            <p
              className="totw-secondary-text m-0 mt-2 "
              style={{ maxWidth: "none" }}
            >
              Connected wallet address: {account}
            </p>
            {isModel && (
              <p
                className="totw-secondary-text m-0 pb-3"
                style={{ maxWidth: "none" }}
              >
                <a
                  href="https://t.me/TreatContentCreators"
                  target="_blank"
                  className="text-primary"
                  rel="noreferrer"
                >
                  <small>
                    <b>Join our creator Telegram community</b>
                  </small>
                </a>
              </p>
            )}
            {isModel && (
              <Link href={`/creator/${modelData.username}`}>
                <a>
                  <Button className="bg-primary text-white font-bold">
                    <b>{"Go to My Creator Profile"}</b>
                  </Button>
                </a>
              </Link>
            )}
          </div>

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
            className="mt-4 mt-md-0"
          ></div>
        </div>
        <DashboardTabs
          modelData={modelData}
          nftError={nftError}
          listOrderClick={listOrderClick}
          transferNFTClick={transferNFTClick}
          ownedNFTData={ownedNFTData}
          isOwnedLoading={isOwnedLoading}
          navigate={navigate}
          ownedNFTDataError={ownedNFTDataError}
          cancelOrderClick={cancelOrderClick}
          resaleNFTData={resaleNFTData}
          isOpenOrdersLoading={isOpenOrdersLoading}
          resaleNFTDataError={resaleNFTDataError}
          hideNFTs={hideNFTs}
          nftData={nftData}
          subNftError={subNftError}
          subNftData={subNftData}
          isLoading={isLoading}
          isModel={isModel}
        />
      </div>
    </Layout>
  );
};

export const getServerSideProps = getModelData;
export default CreatorDashboardWrapper;
