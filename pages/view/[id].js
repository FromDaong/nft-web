import React, { useState, useEffect } from "react";
import Spinner from "react-bootstrap/Spinner";
import Button from "react-bootstrap/Button";
import useSWR from "swr";
import useGetNftMaxSupply from "../../hooks/useGetNftMaxSupply";
import useGetNftTotalSupply from "../../hooks/useGetNftTotalSupply";
import useGetTreatNFTCost from "../../hooks/useGetTreatNftCost";
import useMintNft from "../../hooks/useMintNft";
import useWallet from "use-wallet";
import { getBalanceNumber,  getDisplayBalance, getFullDisplayBalance} from "../../utils/formatBalance";
import { generateFromString } from "generate-avatar";

const RedeemButton = ({ onMintNft, remainingNfts, nftData }) => {
  const [success, setSuccess] = useState(false);
  const { account } = useWallet();

  const SubmitToServer = async (mint) => {
    console.log('submit mint', mint)
    if(mint) {
        nftData.mints.push(mint);
    }
    try {
      const res = await fetch(`/api/nft/${nftData.id}`, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(nftData),
      });
      const resJSON = await res.json();

      if (resJSON.error && resJSON.error.errors) {
        console.log(resJSON.error);
        const ogErrors = Object.assign({}, resJSON.error.errors);
        Object.keys(ogErrors).map((e) => {
          ogErrors[e] = resJSON.error.errors[e].message;
        });
      }

      if (resJSON.success) {
        setSuccess(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const [disabled, setDisabled] = useState(false)

  return (
    <Button
      variant="primary w-100 mt-3 py-3"
      style={{ borderRadius: 7 }}
      onClick={async () => {
        setDisabled(true)
        // const txHash = await onMintNft();
        const txHash = '0x1234'
        const mint = {
          transactionHash: txHash,
          nftId: nftData.id,
          buyer: account,
          price: nftData.list_price,
          timestamp: new Date(),
        };
        await SubmitToServer(mint);
        setDisabled(false)
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
  const [image, setBase64Image] = useState();
  const { status } = useWallet();

  useEffect(() => {
    (async () => {
      console.log({ res });
      if (res) {
        setNftData(res);

        fetch(res.image)
          .then((r) => r.text())
          .then((blob) => {
            setBase64Image(blob.replace(`"`, "").replace(/["']/g, ""));
          });
      }
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
    console.log({ nftData });
    return <ViewNFT nftData={nftData} image={image} />;
  }
};

const ViewNFT = ({ nftData, image, account }) => {
  const nftCost = useGetTreatNFTCost(nftData.id);
  const maxNftSupply = useGetNftMaxSupply(nftData.id);
  const mintedNfts = useGetNftTotalSupply(nftData.id);
  const remainingNfts = maxNftSupply.minus(mintedNfts);
  const { onMintNft } = useMintNft(nftData.id, nftCost);

  const data = {
    id: 2,
    edition: "1 OF 1",
    name: "Morning Wood",
    price: 1.05,
    creator_share: 80,
    creator: {
      profile_pic:
        "https://pbs.twimg.com/profile_images/1357419789040439302/lmUkL7j__400x400.jpg",
      name: "alenaxbt",
    },
    placeholder_image: "",
  };

  console.log(maxNftSupply);

  const historyEvents = nftData.mints.map( (m) => {
    return {
      when: m.timestamp.toString(),
      event: `${m.buyer} bought for ${m.price}`  // TODO: look up username from account
    }
  });
  // const historyEvents = [
  //   {
  //     when: "5 HOURS AGO",
  //     event: "@alenaxbt set the asking price to 1.05BNB",
  //   },
  //   {
  //     when: "7 HOURS AGO",
  //     event: "@alenaxbt set the asking price to 3.2BNB",
  //   },
  //   {
  //     when: "7 HOURS AGO",
  //     event: "@alenaxbt minted this NFT",
  //   },
  // ];

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
            {image ? (
              <img src={image} />
            ) : (
              <Spinner animation="border" role="status" className="mt-5 mb-5">
                <span className="sr-only">Loading...</span>
              </Spinner>
            )}
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
