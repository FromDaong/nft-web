import React, { useState, useEffect } from "react";
import Spinner from "react-bootstrap/Spinner";
import Button from "react-bootstrap/Button";
import { Tabs, Tab } from "react-bootstrap";
import useSWR from "swr";
import Web3 from "web3";
import Link from "next/link";
import Layout from "../../components/Layout";
import { useRouter } from "next/router";
import { modelSetBundles } from "../../treat/lib/constants";
import useGetTreatSetCost from "../../hooks/useGetTreatSetCost";
import useRedeemSet from "../../hooks/useRedeemSet";
import { useWallet } from "use-wallet";
import SweetShopNFTs from "../../components/CreatorPage/SweetShopNFTs";
import SubscriptionNFTs from "../../components/CreatorPage/SubscriptionNFTs";
import useGetSubscriptionCost from "../../hooks/useGetSubscriptionCost";
import useGetIsSubscribed from "../../hooks/useGetIsSubscribed";
import { Clipboard } from "react-bootstrap-icons";

const ViewModelWrapper = ({ username }) => {
  const { data: res } = useSWR(`/api/model/${username}`);
  const [modelData, setModelData] = useState();
  const [subNFTs, setSubNFTs] = useState([]);
  const [totwNFTs, setTotwNFTs] = useState([]);
  const [modelNFTs, setModelNFTs] = useState();
  const [newNFTs, setNewNFTs] = useState([]);
  const [outOfPrintNFTs, setOutOfPrintNFTs] = useState([]);
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
          (nft) => nft.maxSupply > nft.totalSupply && !nft.totw && !nft.old_totw
        );
        let outOfPrint = mNfts.filter(
          (nft) => nft.maxSupply === nft.totalSupply || nft.old_totw
        );
        let getTotwNFTs = mNfts.filter((nft) => nft.totw);

        console.log({ newNFTs });

        setModelNFTs(mNfts);
        setNewNFTs(newNFTs);
        setTotwNFTs(getTotwNFTs);
        setSubNFTs(fetchedSubNFTs);
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
  } else {
    return (
      <Layout>
        <ViewModel
          modelData={modelData}
          subNFTs={subNFTs}
          modelNFTs={modelNFTs}
          totwNFTs={totwNFTs}
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
  newNFTs,
  subNFTs,
  totwNFTs,
  outOfPrintNFTs,
  onRedeemSet,
}) => {
  const [copied, setCopied] = useState(false);
  const { account } = useWallet();
  const subscriptionCost = useGetSubscriptionCost(modelData.address || "");
  const isSubscribed = useGetIsSubscribed(modelData.address || "");
  const formattedSubCost = Web3.utils.fromWei(subscriptionCost.toString());
  const [key, setKey] = useState(totwNFTs.length !== 0 ? "totw" : "sweet");

  useEffect(() => {
    if (Number(formattedSubCost) !== 0) setKey("sub");
  }, [formattedSubCost]);

  console.log(subNFTs);

  return (
    <div className="container">
      <div className="view-model white-tp-bg">
        <div
          className="banner"
          style={{ backgroundImage: `url(${modelData.banner_pic})` }}
        ></div>
        <div className="profile-top-container col-md-12">
          <div
            style={{ backgroundImage: `url(${modelData.profile_pic})` }}
            className="profile-pic"
          />
          <div className="buttons">
            {account === modelData.address && (
              <div className="mr-2">
                <Link href="/creator-dashboard">
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
                </Link>
              </div>
            )}
            <div>
              <Button
                className="px-4"
                style={{ marginTop: 15, width: "100%", borderRadius: 25 }}
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
            <a className="link" href={modelData.social_account} target="_blank">
              {modelData.social_account}
            </a>
          </div>
          <div className="tabs-container">
            <Tabs
              id="controlled-tab-example"
              activeKey={key}
              onSelect={(k) => setKey(k)}
              className="mb-3"
            >
              {totwNFTs.length > 0 && (
                <Tab eventKey="totw" title="TOTW NFTs">
                  <SweetShopNFTs
                    modelNFTs={totwNFTs}
                    onRedeemSet={onRedeemSet}
                    modelData={modelData}
                  />
                </Tab>
              )}
              {Number(formattedSubCost) !== 0 && (
                <Tab eventKey="sub" title="Subscription NFTs">
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
              <Tab eventKey="sweet" title="Sweet Shop NFTs">
                <SweetShopNFTs
                  modelNFTs={newNFTs}
                  onRedeemSet={onRedeemSet}
                  modelData={modelData}
                />
              </Tab>
              <Tab eventKey="soldout" title="Sold out NFTs">
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
        <div className="w-100 text-center mt-15">
          <Button style={{ marginTop: 15 }}>Back to All Creators</Button>
        </div>
      </Link>
    </div>
  );
};

ViewModelWrapper.getInitialProps = async ({ query: { username } }) => {
  return { username };
};

export default ViewModelWrapper;
