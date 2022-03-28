import {
  ArrowRepeat,
  CameraFill,
  CollectionFill,
  GearFill,
  InfoCircleFill,
  PatchCheckFill,
  PencilFill,
  PiggyBankFill,
} from "react-bootstrap-icons";
import { Button, Spinner } from "react-bootstrap";
import { Nav, Tab } from "react-bootstrap";
import { useEffect, useState } from "react";

import Axios from "axios";
import BlankModal from "../../components/BlankModal";
import CancelOrderModal from "../../components/CancelOrderModal";
import CreatedNFTs from "../../components/CreatorDashboard/CreatedNFTs";
import CreatorResources from "../../components/CreatorDashboard/CreatorResources";
import EditProfile from "../../components/CreatorDashboard/EditProfile";
import ErrorFallback from "../../components/Fallback/Error";
import Layout from "../../components/Layout";
import Link from "next/link";
import ListOrderModal from "../../components/ListOrderModal";
import OwnedNFTs from "../../components/CreatorDashboard/OwnedNFTs";
import Referrals from "../../components/CreatorDashboard/Referrals";
import ResaleNFTs from "../../components/CreatorDashboard/ResaleNFTs";
import SubSettingsBox from "../../components/CreatorDashboard/SubSettingsBox";
import SubscriptionNFTs from "../../components/CreatorDashboard/SubscriptionNFTs";
import SubscriptionSettings from "../../components/CreatorDashboard/SubscriptionSettings";
import TransferNFTModal from "../../components/TransferNFTModal";
import { useMoralis } from "react-moralis";
import useSWR from "swr";

const CreatorDashboardWrapper = ({ modelData }) => {
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

  if (!isAuthenticated || !modelData) {
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
            <Link href={`/creator/${modelData.username}`}>
              <a>
                <Button className="bg-primary text-white font-bold">
                  <b>{"Go to My Creator Profile"}</b>
                </Button>
              </a>
            </Link>
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
        <Tab.Container id="left-tabs-example" defaultActiveKey="edit-profile">
          <div className="mt-2 row">
            <div className="col-md-2 p-0">
              <Nav variant="pills" className="flex-column">
                <Nav.Item className="white-tp-bg">
                  <Nav.Link eventKey="edit-profile">
                    <PencilFill className="mr-2 mb-1" />
                    Edit Profile
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item className="white-tp-bg mt-2">
                  <Nav.Link eventKey="owned-nfts">
                    <CollectionFill className="mr-2 mb-1" />
                    Owned NFTs
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item className="white-tp-bg mt-2">
                  <Nav.Link eventKey="resale-nfts">
                    <ArrowRepeat className="mr-2 mb-1" />
                    Resale NFTs
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item className="white-tp-bg mt-2">
                  <Nav.Link eventKey="created-nfts">
                    <CameraFill className="mr-2 mb-1" />
                    Sweet Shop NFTs
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item className="white-tp-bg mt-2">
                  <Nav.Link eventKey="subscription-nfts">
                    <PatchCheckFill className="mr-2 mb-1" />
                    Subscription NFTs
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item className="white-tp-bg mt-2">
                  <Nav.Link eventKey="subscription-settings">
                    <GearFill className="mr-2 mb-1" />
                    Subscription Settings
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item className="white-tp-bg mt-2">
                  <Nav.Link eventKey="creator-resources">
                    <InfoCircleFill className="mr-2 mb-1" />
                    Creator Resources
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item className="white-tp-bg mt-2">
                  <Nav.Link eventKey="referrals">
                    <PiggyBankFill className="mr-2 mb-1" />
                    Referrals
                  </Nav.Link>
                </Nav.Item>
              </Nav>
            </div>
            <div className="col-md-10 pr-0 mt-4 mt-md-0 pl-0 pl-md-3">
              <Tab.Content>
                <Tab.Pane eventKey="edit-profile">
                  <EditProfile modelData={modelData} />
                </Tab.Pane>
                <Tab.Pane eventKey="owned-nfts">
                  {!nftError ? (
                    <OwnedNFTs
                      listOrderClick={listOrderClick}
                      transferNFTClick={transferNFTClick}
                      ownedNFTData={ownedNFTData}
                      isLoading={isOwnedLoading}
                      navigate={navigate}
                      error={ownedNFTDataError}
                    />
                  ) : (
                    <ErrorFallback custom="Failed to load Owned NFTs" />
                  )}
                </Tab.Pane>
                <Tab.Pane eventKey="resale-nfts">
                  {!nftError ? (
                    <ResaleNFTs
                      cancelOrderClick={cancelOrderClick}
                      transferNFTClick={transferNFTClick}
                      resaleNFTData={resaleNFTData}
                      revealNFTs={resaleNFTData}
                      isLoading={isOpenOrdersLoading}
                      navigate={navigate}
                      error={resaleNFTDataError}
                    />
                  ) : (
                    <ErrorFallback custom="Failed to load Resale NFTs" />
                  )}
                </Tab.Pane>
                <Tab.Pane eventKey="created-nfts">
                  {!nftError ? (
                    <CreatedNFTs
                      hideNFTs={hideNFTs}
                      transferNFTClick={transferNFTClick}
                      nftData={nftData}
                      modelData={modelData}
                    />
                  ) : (
                    <ErrorFallback custom="Failed to load NFTs" />
                  )}
                </Tab.Pane>
                <Tab.Pane eventKey="subscription-nfts">
                  {!subNftError ? (
                    <SubscriptionNFTs
                      hideNFTs={hideNFTs}
                      transferNFTClick={transferNFTClick}
                      nftData={subNftData}
                      modelData={modelData}
                    />
                  ) : (
                    <ErrorFallback custom="Error loading sub NFTs" />
                  )}
                </Tab.Pane>
                <Tab.Pane eventKey="subscription-settings">
                  <SubscriptionSettings />
                  <SubSettingsBox />
                </Tab.Pane>
                <Tab.Pane eventKey="creator-resources">
                  <CreatorResources />
                </Tab.Pane>
                <Tab.Pane eventKey="referrals">
                  <Referrals
                    hideNFTs={hideNFTs}
                    transferNFTClick={transferNFTClick}
                    isLoading={isLoading}
                    nftData={nftData}
                    modelData={modelData}
                  />
                </Tab.Pane>
              </Tab.Content>
            </div>
          </div>
        </Tab.Container>
      </div>
    </Layout>
  );
};
export default CreatorDashboardWrapper;
