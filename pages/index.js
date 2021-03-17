import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import NFTListItem from "../components/NFTListItem";
import useSWR from "swr";

const Home = () => {
  const { data: res } = useSWR(`/api/nft`);
  const [nftData, setNftData] = useState();

  const [showToast, setShowToast] = useState(true);
  const toggleShowToast = () => setShowToast(!showToast);

  useEffect(() => {
    (async () => {
      console.log({ res });
      if (res) {
        setNftData(res);
      }
    })();
  }, [res]);

  const nftList = [
    {
      id: 1,
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
    },
    {
      id: 2,
      edition: "1 OF 1",
      name: "Toe-licious",
      price: 0.55,
      creator_share: 80,
      creator: {
        profile_pic:
          "https://pbs.twimg.com/profile_images/1140051236420554752/7Y9fRcHc_400x400.jpg",
        name: "feetlover",
      },
      placeholder_image: "https://i.imgur.com/8oNpRfA.png",
    },
  ];

  let nftListRender;

  if (nftData) {
    nftListRender = nftData.map((nft) => (
      <NFTListItem key={nft.id} data={nft} />
    ));
  } else {
    nftListRender = (
      <Spinner
        animation="border"
        role="status"
        size="xl"
        style={{ textAlign: "center" }}
      >
        <span className="sr-only">Loading...</span>
      </Spinner>
    );
  }

  return (
    <div className="home">
      <div className="hero">
        <div className="row">
          <div className="col-lg-6 hero-text">
            <div className="heading-text">
              Maybe it's time to treat yourself...
            </div>
            <div className="secondary-text">
              Treat is an exclusive platform for models to sell NFTs. Hold
              $TREAT to have a say on which models are chosen & new platform
              features.
            </div>
            <div className="buttons row pt-4">
              <div className="col-md-6  mt-2">
                <Button variant="primary py-2 w-100">
                  <b>BROWSE NFTs</b>
                </Button>
              </div>
              <div className="col-md-6 mt-2">
                <Button variant="light w-100 py-2 text-primary">
                  <b>INDULGE IN A $TREAT</b>
                </Button>
              </div>
            </div>
          </div>
          <div className="col-lg-1"></div>
          <div className="col-lg-5 hero-logo-container mt-5">
            <img src={"/assets/hero-logo.png"} alt="" />
          </div>
        </div>
      </div>
      <div className="nft-list">{nftListRender}</div>
    </div>
  );
};

export default Home;
