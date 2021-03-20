import React, { useState, useEffect } from "react";
import Spinner from "react-bootstrap/Spinner";
import Button from "react-bootstrap/Button";
import useSWR from "swr";
import useGetNftMaxSupply from "../../hooks/useGetNftMaxSupply";
import useGetNftTotalSupply from "../../hooks/useGetNftTotalSupply";
import useGetTreatNFTCost from "../../hooks/useGetTreatNftCost";
import useMintNft from "../../hooks/useMintNft";
import useWallet from "use-wallet";
import { getDisplayBalance } from "../../utils/formatBalance";
import { generateFromString } from "generate-avatar";
import { Blurhash } from "react-blurhash";

const RedeemButton = ({ onMintNft, remainingNfts, nftData }) => {
  const { account } = useWallet();

  const SubmitToServer = async (mint) => {
    try {
      const res = await fetch(`/api/nft/${nftData.id}`, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ mint }),
      });
      const resJSON = await res.json();

      if (resJSON.success) {
        if (typeof window !== "undefined") window.reload();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const [disabled, setDisabled] = useState(false);

  return (
    <Button
      variant="primary w-100 mt-3 py-3"
      style={{ borderRadius: 7 }}
      disabled={disabled}
      onClick={async () => {
        setDisabled(true);
        const txHash = await onMintNft();
        // const txHash = "0x1234";
        const mint = {
          transactionHash: txHash,
          nftId: nftData.id,
          buyer: account,
          price: nftData.list_price,
          timestamp: new Date(),
        };
        await SubmitToServer(mint);
        setDisabled(false);
      }}
      disabled={remainingNfts.toNumber() == 0}
    >
      <b>{remainingNfts.toNumber() > 0 ? `BUY NOW` : "SOLD OUT"}</b>
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
          Please make sure your BNB wallet is connected.
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
  const nftCost = useGetTreatNFTCost(nftData.id);
  const maxNftSupply = useGetNftMaxSupply(nftData.id);
  const mintedNfts = useGetNftTotalSupply(nftData.id);
  const remainingNfts = maxNftSupply.minus(mintedNfts);
  const { onMintNft } = useMintNft(nftData.id, nftCost);

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

  return (
    <div className="container">
      <div className="view-nft row">
        <div className="image-wrapper col-lg-4 p-0 pr-lg-3">
          <div className="image-container text-center text-lg-left">
            <Blurhash
              style={{ borderRadius: 5, overflow: "hidden" }}
              hash={nftData.blurhash}
              width={"100%"}
              height={500}
              resolutionX={32}
              resolutionY={32}
              punch={1}
            />
            <RedeemButton
              onMintNft={onMintNft}
              remainingNfts={remainingNfts}
              nftData={nftData}
              account={account}
            />
          </div>
        </div>
        <div className="col-lg-8 text-container container mt-4 mt-lg-0">
          <div className="title-section">
            <div>
              <div className="title">{nftData.name}</div>
              <div className="bio">{nftData.description}</div>
            </div>
            <div className="edition">
              <div>MAX SUPPLY: {maxNftSupply.toNumber()}</div>
              <div>REMAINING: {remainingNfts.toNumber()}</div>
            </div>
          </div>
          <div className="stats">
            <div className="stat">
              <div className="label">LIST PRICE</div>
              <div className="number">{getDisplayBalance(nftCost)} BNB</div>
            </div>
            <div className="stat">
              <div className="label">CREATOR SHARE</div>
              <div className="number">80%</div>
            </div>
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
            <div className="history-title">Purchase History</div>
            {/* <div className="bio">Coming soon...</div> */}
            <div className="history-events">{historyEventsRender}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

ViewNFTWrapper.getInitialProps = async ({ query: { id } }) => {
  return { id };
};

export default ViewNFTWrapper;
