import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Spinner, Button } from "react-bootstrap";
import EditProfile from "../../components/CreatorDashboard/EditProfile";
import CreatedNFTs from "../../components/CreatorDashboard/CreatedNFTs";
import SubscriptionSettings from "../../components/CreatorDashboard/SubscriptionSettings";
import SubSettingsBox from "../../components/CreatorDashboard/SubSettingsBox";
import CreatorResources from "../../components/CreatorDashboard/CreatorResources";
import Referrals from "../../components/CreatorDashboard/Referrals";
import { Nav, Tab } from "react-bootstrap";
import useGetNftMaxSupply from "../../hooks/useGetNftMaxSupply";
import { useWallet } from "use-wallet";
import Link from "next/link";
import useSWR from "swr";
import Layout from "../../components/Layout";
import {
  CameraFill,
  PatchCheckFill,
  GearFill,
  PiggyBankFill,
  InfoCircleFill,
  PencilFill,
} from "react-bootstrap-icons";
import SubscriptionNFTs from "../../components/CreatorDashboard/SubscriptionNFTs";
import ErrorFallback from "../../components/Fallback/Error";

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
  // const [serverNftBalances, setServerNftBalances] = useState(null);

  // const maxNftSupply = useGetNftMaxSupply(account);
  const [isLoading, setIsLoading] = useState(false);

  const { data: nftData, error: nftError } = useSWR(
    `/api/model/nfts-from-address/${account}`
  );
  const { data: subNftData, error: subNftError } = useSWR(
    `/api/model/sub-nfts-from-address/${account}`
  );

  const transferNFTClick = (x) => {
    setTransferNFTData(x);
  };

  const hideNFTs = async () => {
    setServerNftBalances(null);
  };

  return (
    <Layout>
      <div className="container  my-nft-container">
        <div className="pink-bg d-flex my-5 row justify-content-between">
          <div>
            <div
              className="heading-text p-0"
              style={{ fontSize: "3.5em", lineHeight: 1.2 }}
            >
              {modelData && modelData.username}'s Dashboard
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
              >
                <small>
                  <b>Join our creator Telegram community</b>
                </small>
              </a>
            </p>
            <Link href={`/creator/${modelData.username}`}>
              <a>
                <Button variant="primary  w-sm-100">
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
            <div className="col-md-3 p-0">
              <Nav variant="pills" className="flex-column">
                <Nav.Item className="white-tp-bg">
                  <Nav.Link eventKey="edit-profile">
                    <PencilFill className="mr-2 mb-1" />
                    Edit Profile
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
            <div className="col-md-9 pr-0 mt-4 mt-md-0 pl-0 pl-md-3">
              <Tab.Content>
                <Tab.Pane eventKey="edit-profile">
                  <EditProfile modelData={modelData} />
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
