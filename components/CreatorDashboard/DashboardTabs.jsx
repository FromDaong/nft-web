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
import { Nav, Tab } from "react-bootstrap";

import CreatedNFTs from "./CreatedNFTs";
import CreatorResources from "./CreatorResources";
import EditProfile from "./EditProfile";
import ErrorFallback from "../Fallback/Error";
import OwnedNFTs from "./OwnedNFTs";
import React from "react";
import Referrals from "./Referrals";
import ResaleNFTs from "./ResaleNFTs";
import SubSettingsBox from "./SubSettingsBox";
import SubscriptionNFTs from "./SubscriptionNFTs";
import SubscriptionSettings from "./SubscriptionSettings";

export default function DashboardTabs({
  modelData,
  nftError,
  listOrderClick,
  transferNFTClick,
  ownedNFTData,
  isOwnedLoading,
  navigate,
  ownedNFTDataError,
  cancelOrderClick,
  resaleNFTData,
  isOpenOrdersLoading,
  resaleNFTDataError,
  hideNFTs,
  nftData,
  subNftError,
  subNftData,
  isLoading,
}) {
  return (
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
        <div className="col-md-9 pr-0 mt-4 mt-md-0 pl-0 pl-md-3">
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
  );
}
