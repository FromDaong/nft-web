import React, { useState, useEffect } from "react";
import Spinner from "react-bootstrap/Spinner";
import Button from "react-bootstrap/Button";
import useSWR from "swr";
import useGetNftMaxSupply from "../../hooks/useGetNftMaxSupply";
import useGetFreeTreat from "../../hooks/useGetFreeTreat";
import useGetNftTotalSupply from "../../hooks/useGetNftTotalSupply";
import useGetTreatNFTCost from "../../hooks/useGetTreatNftCost";
import getCreatorNftCost from "../../hooks/useGetCreatorNftCost";
import useGetOpenOrdersForNft from "../../hooks/useGetOpenOrdersForNft";
import useMintCreatorNft from "../../hooks/useMintCreatorNft";
import useMintNft from "../../hooks/useMintNft";
import useWallet from "use-wallet";
import { getDisplayBalance } from "../../utils/formatBalance";
import { generateFromString } from "generate-avatar";
import { Blurhash } from "react-blurhash";
import NFTPurchaseModal from "../../components/NFTPurchaseModal";
import Layout from "../../components/Layout";
import { EyeSlash } from "react-bootstrap-icons";
import BigNumber from "bignumber.js";
import Link from "next/link";
import Web3 from "web3";

const RedeemButton = ({ onMintNft, remainingNfts, nftData, setShowModal }) => {
  const { account } = useWallet();

  const [disabled, setDisabled] = useState(false);
  const [confirmWallet, setConfrimWallet] = useState(false);

  console.log(remainingNfts.toNumber());

  if (remainingNfts.toNumber() < 0 || isNaN(remainingNfts.toNumber())) {
    return (
      <Spinner animation="border" role="status" className="p3 mt-3 mb-2">
        <span className="sr-only">Loading...</span>
      </Spinner>
    );
  }

  return (
    <Button
      variant="primary w-100 mt-3 py-3"
      style={{ borderRadius: 7 }}
      disabled={disabled || remainingNfts.toNumber() === 0}
      onClick={async () => {
        setDisabled(true);
        setConfrimWallet(true);

        const txHash = await onMintNft();
        console.log({ txHash });
        if (!txHash) {
          setDisabled(false);
          return;
        }

        setConfrimWallet(false);
        setShowModal(true);

        // const txHash = "0x1234";
        const mint = {
          transactionHash: txHash.transactionHash,
          nftId: nftData.id,
          buyer: account,
          price: nftData.list_price,
          timestamp: new Date(),
        };
        localStorage.setItem("tx", JSON.stringify(mint));
        setDisabled(false);
      }}
    >
      {disabled ? (
        <div>
          <Spinner
            animation="border"
            role="status"
            style={{ marginRight: 4, marginBottom: 1 }}
            size="sm"
          >
            <span className="sr-only">Loading...</span>
          </Spinner>
          <span>
            {confirmWallet
              ? " Please confirm in your wallet"
              : "Please wait..."}
          </span>
        </div>
      ) : (
        <b>
          {remainingNfts.toNumber() > 0 && `BUY NOW`}
          {remainingNfts.toNumber() === 0 && `SOLD OUT`}
        </b>
      )}
    </Button>
  );
};

const ViewNFTWrapper = ({ id }) => {
  const { data: res } = useSWR(`/api/nft/${id}`);
  const [nftData, setNftData] = useState();
  const { status } = useWallet();

  useEffect(() => {
    (async () => {
      console.log({ res });
      if (res) setNftData(res);
    })();
  }, [res]);

  if (!nftData || !nftData.id || status !== "connected") {
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
          Please make sure your Binance Smart Chain wallet is connected.
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
    return <ViewNFT nftData={nftData} />;
  }
};

const ViewNFT = ({ nftData, image, account }) => {
  const totwNftCost = useGetTreatNFTCost(nftData.id);
  const creatorNftCost = getCreatorNftCost(nftData.id);

  const nftCost = nftData.old_totw ? totwNftCost : creatorNftCost;
  console.log({ nftCost: nftCost.toString() });

  const maxNftSupply = useGetNftMaxSupply(nftData.id);
  const mintedNfts = useGetNftTotalSupply(nftData.id);
  const remainingNfts = maxNftSupply.minus(mintedNfts);
  const { onMintNft: onMintTotwNft } = useMintNft(nftData.id, nftCost);
  const { onMintCreatorNft } = useMintCreatorNft(nftData.id, nftCost);
  const onMintNft = async () => {
    if (nftData.old_totw) {
      return await onMintTotwNft();
    } else {
      return await onMintCreatorNft();
    }
  };
  const [showModal, setShowModal] = useState(false);
  const { onGetFreeTreat } = useGetFreeTreat(nftData.id, nftCost);
  const openOrders = useGetOpenOrdersForNft(nftData.id);

  console.log({ openOrders });

  const historyEvents = nftData.mints.map((m) => {
    return {
      when: m.timestamp.toString(),
      event: `${m.buyer} bought for ${m.price}`, // TODO: look up username from account
    };
  });

  const historyEventsRender = historyEvents.map((e) => (
    <div className="history-event">
      <div className="pic">
        <img src={nftData.model_profile_pic} />
      </div>
      <div className="details">
        <div className="label">{e.when}</div>
        <div className="event">{e.event}</div>
      </div>
    </div>
  ));

  const openOrdersRender = openOrders.map((e) => (
    <Link href={`/marketplace?search=${nftData.name}`} passHref={true}>
      <a>
        <div className="history-event">
          <div className="pic">
            <img src={nftData.model_profile_pic} />
          </div>
          <div className="details">
            <div className="label">{e.seller}</div>
            <div className="event">
              is selling theirs for {getDisplayBalance(new BigNumber(e.price))}
              BNB
            </div>
          </div>
        </div>
      </a>
    </Link>
  ));

  return (
    <Layout>
      <div className="container">
        <NFTPurchaseModal
          handleClose={() => setShowModal(false)}
          show={showModal}
        />
        <div className="view-nft row">
          <div className="image-wrapper col-lg-4 p-0 pr-lg-3">
            <div className="image-container text-center text-lg-left">
              <div style={{ position: "relative", width: "100%" }}>
                {nftData.image ? (
                  <img src={nftData.image} className="dynamic-image" />
                ) : (
                  <>
                    <div className="info-overlay">
                      <EyeSlash size={32} />
                      <div>Purchase to View</div>
                    </div>
                    <Blurhash
                      style={{
                        borderRadius: 8,
                        overflow: "hidden",
                      }}
                      hash={nftData.blurhash}
                      width={"100%"}
                      height={375}
                      resolutionX={32}
                      resolutionY={32}
                      punch={1}
                    />
                  </>
                )}
              </div>
              <RedeemButton
                onMintNft={
                  nftData.list_price === 0 ? onGetFreeTreat : onMintNft
                }
                remainingNfts={remainingNfts}
                nftData={nftData}
                setShowModal={setShowModal}
                account={account}
              />
            </div>
          </div>
          <div className="col-lg-8 text-container container mt-4 mt-lg-0">
            <div className="title-section">
              {/* <div className="edition mb-1"> */}
              {/* <div>REMAINING: {remainingNfts.toNumber()}</div> */}
              <div>
                {nftData.totw && (
                  <div className="edition mb-2">AVAILABLE THIS WEEK ONLY</div>
                )}
                {!nftData.old_totw &&
                  nftData.max_supply &&
                  nftData.max_supply < 100000 && (
                    <div className="edition mb-2">
                      Max Supply: {nftData.maxSupply}
                    </div>
                  )}
                <div className="title">{nftData.name}</div>
                <div className="bio">{nftData.description}</div>
              </div>
            </div>
            <div className="stats">
              <div className="stat">
                <div className="label">LIST PRICE</div>
                <div className="number">{getDisplayBalance(nftCost)} BNB</div>
              </div>
              {/* <div className="stat">
              <div className="label">CREATOR SHARE</div>
              <div className="number">75%</div>
            </div> */}
            </div>
            <div className="creator-wrapper">
              <div className="creator">
                <div className="pic">
                  <img
                    src={
                      nftData.model_profile_pic ||
                      `data:image/svg+xml;utf8,${generateFromString(
                        nftData.model_handle
                      )}`
                    }
                  />
                </div>
                <div className="details">
                  <div className="label">CREATOR</div>
                  <div className="name">{nftData.model_handle}</div>
                </div>
              </div>
            </div>
            <hr style={{ marginTop: 25, marginBottom: 25 }} />
            <div className="history-container">
              <div className="history-title">Marketplace Listings</div>
              {/* <div className="bio">Coming soon...</div> */}
              <div className="history-events">{openOrdersRender}</div>
            </div>
            <hr style={{ marginTop: 25, marginBottom: 25 }} />
            <div className="history-container">
              <div className="history-title">Purchase History</div>
              {/* <div className="bio">Coming soon...</div> */}
              <div className="history-events">{historyEventsRender}</div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

ViewNFTWrapper.getInitialProps = async ({ query: { id } }) => {
  return { id };
};

export default ViewNFTWrapper;
