import React, { useEffect, useState } from "react";
import { Tab, Tabs } from "react-bootstrap";

import { PatchCheck, RecordCircle, Shop, BagX } from "react-bootstrap-icons";
import { Button } from "@chakra-ui/react";
import { Clipboard } from "react-bootstrap-icons";
import ErrorFallback from "../../components/Fallback/Error";
import Layout from "../../components/Layout";
import Link from "next/link";
import Spinner from "react-bootstrap/Spinner";
import SubscriptionNFTs from "../../components/CreatorPage/SubscriptionNFTs";
import SweetShopNFTs from "../../components/CreatorPage/SweetShopNFTs";
import LivestreamViewing from "../../components/CreatorPage/LivestreamViewing";
import Web3 from "web3";
import useGetIsSubscribed from "../../hooks/useGetIsSubscribed";
import useGetSubscriptionCost from "../../hooks/useGetSubscriptionCost";
import { useMoralis } from "react-moralis";
import { useRouter } from "next/router";
import useSWR from "swr";

const ViewModelWrapper = ({ username }) => {
  const { data: res, error } = useSWR(`/api/model/${username}`);
  const [modelData, setModelData] = useState();
  const [subNFTs, setSubNFTs] = useState();
  const [totwNFTs, setTotwNFTs] = useState();
  const [totmNFTs, setTotmNFTs] = useState();
  const [modelNFTs, setModelNFTs] = useState();
  const [newNFTs, setNewNFTs] = useState();
  const [outOfPrintNFTs, setOutOfPrintNFTs] = useState();
  const router = useRouter();

  useEffect(() => {
    (async () => {
      if (res) {
        setModelData(res);

        if (!res.nfts || res.nfts.length === 0) setModelNFTs([]);
        const mNfts = await Promise.all(
          res.nfts.map(async (nft) => {
            const x = await fetch(`/api/nft/${nft.id}`);
            const j = await x.json();
            return j;
          })
        );

        const fetchedSubNFTs = await Promise.all(
          res.sub_nfts.map(async (nft) => {
            const x = await fetch(`/api/nft/${nft.id}`);

            const j = await x.json();
            return j;
          })
        );

        let newNFTs = mNfts.filter(
          (nft) =>
            nft.maxSupply > nft.totalSupply &&
            !nft.totw &&
            !nft.totm &&
            !nft.old_totw &&
            !nft.old_totm
        );
        let outOfPrint = mNfts.filter(
          (nft) =>
            nft.maxSupply === nft.totalSupply || nft.old_totw || nft.old_totm
        );
        let getTotwNFTs = mNfts.filter((nft) => nft.totw);
        let getTotmNFTs = mNfts.filter((nft) => nft.totm);

        setModelNFTs(mNfts);
        setNewNFTs(newNFTs);
        setTotwNFTs(getTotwNFTs);
        setTotmNFTs(getTotmNFTs);
        setSubNFTs(fetchedSubNFTs);
        setOutOfPrintNFTs(outOfPrint);
      }
    })();
  }, [res]);

  // const setId = modelSetBundles[username];
  // const nftSetPrice = useGetTreatSetCost(setId);
  // const { onRedeemSet } = setId
  //   ? useRedeemSet(setId, nftSetPrice)
  //   : { onRedeemSet: null };

  if (!modelData || !modelData.username) {
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
          Loading Creator...
        </h5>
        <Spinner
          animation="border"
          role="status"
          size="xl"
          style={{ marginTop: 5 }}
        >
          <span className="sr-only">Loading Creator...</span>
        </Spinner>
      </div>
    );
  } else if (error) {
    return <ErrorFallback custom="Failed to load user data" />;
  }
  {
    return (
      <Layout>
        <ViewModel
          modelData={modelData}
          subNFTs={subNFTs}
          modelNFTs={modelNFTs}
          totwNFTs={totwNFTs}
          totmNFTs={totmNFTs}
          newNFTs={newNFTs}
          outOfPrintNFTs={outOfPrintNFTs}
          // nftSetPrice={nftSetPrice}
          // onRedeemSet={onRedeemSet}
        />
      </Layout>
    );
  }
};

const ViewModel = ({
  modelData,
  newNFTs,
  subNFTs,
  totwNFTs,
  totmNFTs,
  outOfPrintNFTs,
  onRedeemSet,
  nftSetPrice,
}) => {
  console.log({ newNFTs, subNFTs, totwNFTs, totmNFTs, outOfPrintNFTs });
  const [copied, setCopied] = useState(false);
  const { account } = useMoralis();
  const subscriptionCost = useGetSubscriptionCost(modelData.address || "");
  const isSubscribed = useGetIsSubscribed(modelData.address || "");
  const formattedSubCost = Web3.utils.fromWei(subscriptionCost.toString());
  const [key, setKey] = useState("sweet");

  useEffect(() => {
    if (Number(formattedSubCost) !== 0) setKey("sub");
  }, [formattedSubCost]);

  const formatURL = (str) => {
    if (str) {
      if (str.length < 1) return str;
      if (str.startsWith("http")) return str;
      return `https://${str}`;
    }
  };

  return (
    <div className="container">
      <div className="view-model white-tp-bg">
        <div
          className="banner"
          style={{
            backgroundImage: `url(${modelData.banner_pic})`,
          }}
        ></div>
        <div className="profile-top-container col-md-12">
          <div
            style={{ backgroundImage: `url(${modelData.profile_pic})` }}
            className="profile-pic"
          />
          <div className="buttons">
            {account === modelData.address && (
              <div className="mr-2">
                <Link href="/dashboard">
                  <a>
                    <Button
                      className="px-4"
                      style={{
                        marginTop: 15,
                        width: "100%",
                        borderRadius: 25,
                        display: "inline-block",
                      }}
                    >
                      Edit Profile
                    </Button>
                  </a>
                </Link>
              </div>
            )}
            <div>
              <Button
                px={4}
                rounded="full"
                colorScheme={"primary"}
                style={{ marginTop: 15, width: "100%" }}
                onClick={() => {
                  navigator.clipboard.writeText(
                    `https://treatdao.com/creator/${modelData.username}`
                  );
                  setCopied(true);
                }}
              >
                {copied ? (
                  <>
                    <Clipboard className="mb-1 mr-1" />
                    Copied
                  </>
                ) : (
                  <>
                    <Clipboard className="mb-1 mr-1" />
                    Copy URL
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        <div className="profile-info">
          <div className="col-md-12">
            <div className="name">
              {modelData.display_name || modelData.username}
            </div>
            <div className="username">@{modelData.username}</div>
            <p className="bio">{modelData.bio}</p>
            <a
              className="link"
              href={formatURL(modelData.social_account)}
              target="_blank"
              rel="noreferrer"
            >
              {formatURL(modelData.social_account)}
            </a>
          </div>
          <div className="tabs-container">
            <Tabs
              id="controlled-tab-example"
              activeKey={key}
              onSelect={(k) => setKey(k)}
              className="mb-3"
              mountOnEnter
            >
              {totwNFTs && totwNFTs.length > 0 && (
                <Tab
                  eventKey="totw"
                  title={
                    <span>
                      <PatchCheck /> TOTW NFTs
                    </span>
                  }
                >
                  <SweetShopNFTs
                    modelNFTs={totwNFTs}
                    onRedeemSet={onRedeemSet}
                    modelData={modelData}
                    nftSetPrice={nftSetPrice}
                  />
                </Tab>
              )}
              {totmNFTs && totmNFTs.length > 0 && (
                <Tab eventKey="totm" title={`TOTM NFTs`}>
                  <SweetShopNFTs
                    modelNFTs={totmNFTs}
                    onRedeemSet={onRedeemSet}
                    modelData={modelData}
                    nftSetPrice={nftSetPrice}
                  />
                </Tab>
              )}
              {Number(formattedSubCost) !== 0 && (
                <Tab
                  eventKey="sub"
                  title={
                    <span>
                      <PatchCheck className="mr-1 mb-1" /> Subscription NFTs
                    </span>
                  }
                >
                  <SubscriptionNFTs
                    isSubscribed={isSubscribed}
                    modelNFTs={subNFTs}
                    onRedeemSet={onRedeemSet}
                    modelData={modelData}
                    subscriptionCost={subscriptionCost}
                    formattedSubCost={formattedSubCost}
                    account={account}
                  />
                </Tab>
              )}
              {Number(formattedSubCost) !== 0 && (
                <Tab
                  eventKey="live"
                  title={
                    <span>
                      <RecordCircle
                        className="mr-1 mb-1"
                        isSubscribed={isSubscribed}
                      />{" "}
                      Livestream
                    </span>
                  }
                >
                  <LivestreamViewing
                    subscriptionCost={subscriptionCost}
                    isSubscribed={isSubscribed}
                    account={account}
                    formattedSubCost={formattedSubCost}
                    streamId={modelData.live.stream_id}
                    modelData={modelData}
                  />
                </Tab>
              )}
              <Tab
                eventKey="sweet"
                title={
                  <span>
                    <Shop className="mr-1 mb-1" /> Sweet Shop NFTs
                  </span>
                }
              >
                <SweetShopNFTs
                  modelNFTs={newNFTs}
                  onRedeemSet={onRedeemSet}
                  modelData={modelData}
                />
              </Tab>
              <Tab
                eventKey="soldout"
                title={
                  <span>
                    <BagX className="mr-1 mb-1" /> Sold Out NFTs
                  </span>
                }
              >
                <SweetShopNFTs
                  modelNFTs={outOfPrintNFTs}
                  onRedeemSet={onRedeemSet}
                  modelData={modelData}
                />
              </Tab>
            </Tabs>
          </div>
        </div>
      </div>
      <Link href="/creators">
        <a className="w-100 text-center mt-15">
          <Button
            style={{ marginTop: 15 }}
            variant="transparent"
            className="text-primary"
          >
            Back to All Creators
          </Button>
        </a>
      </Link>
    </div>
  );
};

ViewModelWrapper.getInitialProps = async ({ query: { username } }) => {
  return { username };
};

export default ViewModelWrapper;
