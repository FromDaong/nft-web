import React, { useState, useEffect } from "react";
import Spinner from "react-bootstrap/Spinner";
import Button from "react-bootstrap/Button";
import { Tabs, Tab } from "react-bootstrap";
import useSWR from "swr";
import Link from "next/link";
import Layout from "../../components/Layout";
import { useRouter } from "next/router";
import { modelSetBundles } from "../../treat/lib/constants";
import useGetTreatSetCost from "../../hooks/useGetTreatSetCost";
import useRedeemSet from "../../hooks/useRedeemSet";
import { useWallet } from "use-wallet";
import SweetShopNFTs from "../../components/CreatorPage/SweetShopNFTs";
import SubscriptionNFTs from "../../components/CreatorPage/SubscriptionNFTs";
import { Clipboard } from "react-bootstrap-icons";

const ViewModelWrapper = ({ username }) => {
  const { data: res } = useSWR(`/api/model/${username}`);
  const [modelData, setModelData] = useState();
  const [modelNFTs, setModelNFTs] = useState();
  const [newNFTs, setNewNFTs] = useState([]);
  const [outOfPrintNFTs, setOutOfPrintNFTs] = useState([]);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      if (res) {
        setModelData(res);

        if (!res.nfts || res.nfts.length === 0) return setModelNFTs([]);

        const mNfts = await Promise.all(
          res.nfts.map(async (nft) => {
            const x = await fetch(`/api/nft/${nft.id}`);
            const j = await x.json();
            console.log({ j });
            return j;
          })
        );

        let newNFTs = mNfts.filter((nft) => nft.maxSupply > nft.totalSupply);
        let outOfPrint = mNfts.filter(
          (nft) => nft.maxSupply === nft.totalSupply
        );

        setModelNFTs(mNfts);
        setNewNFTs(newNFTs);
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
          modelNFTs={modelNFTs}
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
  modelNFTs,
  newNFTs,
  outOfPrintNFTs,
  nftSetPrice,
  onRedeemSet,
}) => {
  const [selectedTab, setSelectedTab] = useState("NEW NFTs");
  const [otherTab, setOtherTab] = useState("OUT OF PRINT");
  const [copied, setCopied] = useState(false);
  const [key, setKey] = useState("sub");
  const { account } = useWallet();

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
            <div className="name">{modelData.username}</div>
            <div className="username">{modelData.username}</div>
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
              <Tab eventKey="sub" title="Subscription NFTs">
                <SubscriptionNFTs
                  isSubscribed={false}
                  modelNFTs={newNFTs}
                  onRedeemSet={onRedeemSet}
                  modelData={modelData}
                />
              </Tab>
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
