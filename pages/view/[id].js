import React, { useState, useEffect } from "react";
import Spinner from "react-bootstrap/Spinner";
import Button from "react-bootstrap/Button";
import useSWR from "swr";
import useGetNftMaxSupply from "../../hooks/useGetNftMaxSupply";
import useGetNftTotalSupply from "../../hooks/useGetNftTotalSupply";
import useMintNft from "../../hooks/useMintNft";

const ViewNFTWrapper = () => {
  const { data: res } = useSWR(`/api/nft/605182f3c7fccba1cf1d20d8`);
  const [nftData, setNftData] = useState();
  const [image, setBase64Image] = useState();

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

  if (!nftData) {
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
          alignItems: "center",
        }}
      >
        <Spinner animation="border" role="status" size="xl">
          <span className="sr-only">Loading...</span>
        </Spinner>
      </div>
    );
  } else {
    console.log({ nftData });
    return <ViewNFT nftData={nftData} image={image} />;
  }
};

const ViewNFT = ({ nftData, image }) => {
  const { onMintNft } = useMintNft(nftData.id);
  const maxNftSupply = useGetNftMaxSupply(nftData.id);
  const mintedNfts = useGetNftTotalSupply(nftData.id);
  const remainingNfts = maxNftSupply.minus(mintedNfts);
  

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

  console.log(maxNftSupply)

  const historyEvents = [
    {
      when: "5 HOURS AGO",
      event: "@alenaxbt set the asking price to 1.05BNB",
    },
    {
      when: "7 HOURS AGO",
      event: "@alenaxbt set the asking price to 3.2BNB",
    },
    {
      when: "7 HOURS AGO",
      event: "@alenaxbt minted this NFT",
    },
  ];

  const historyEventsRender = historyEvents.map((e) => (
    <div className="history-event">
      <div className="pic">
        <img src={data.creator.profile_pic} />
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

            <Button
              variant="primary w-100 mt-3 py-3"
              style={{ borderRadius: 7 }}
              text={remainingNfts.toNumber() > 0 ? priceLabel : "SOLD OUT"}
              onClick={onMintNft}
              disabled={remainingNfts.toNumber() == 0}
            >
              <b>
                {remainingNfts.toNumber() > 0
                  ? "BUY NOW " & priceLabel
                  : "SOLD OUT"}
              </b>
            </Button>
          </div>
        </div>
        <div className="col-lg-8 text-container container mt-4 mt-lg-0">
          <div className="title-section">
            <div className="title">{nftData.name}</div>
            <div className="edition">EDITION {data.edition}</div>
          </div>
          <div className="stats">
            <div className="stat">
              <div className="label">LIST PRICE</div>
              <div className="number">{data.price} BNB</div>
            </div>
            <div className="stat">
              <div className="label">CREATOR SHARE</div>
              <div className="number">{data.creator_share}%</div>
            </div>
          </div>
          <div className="creator-wrapper">
            <div className="creator">
              <div className="pic">
                <img src={data.creator.profile_pic} />
              </div>
              <div className="details">
                <div className="label">CREATOR</div>
                <div className="name">{data.creator.name}</div>
              </div>
            </div>
            <div className="bio">
              Some bio can go here so people know a thing about the model even
              if they have never heard anything about themn before.
            </div>
          </div>
          <hr style={{ marginTop: 25, marginBottom: 25 }} />
          <div className="history-container">
            <div className="history-title">History</div>
            <div className="history-events">{historyEventsRender}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewNFTWrapper;
