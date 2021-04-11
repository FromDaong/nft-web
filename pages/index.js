import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import NFTListItem from "../components/NFTListItem";
import ModelListItem from "../components/ModelListItem";
import useSWR from "swr";
import * as Scroll from "react-scroll";

const Home = () => {
  const { data: nftResult } = useSWR(`/api/nft`);
  const { data: modelResult } = useSWR(`/api/model`);
  const [nftData, setNftData] = useState();
  const [modelData, setModelData] = useState();

  const [showToast, setShowToast] = useState(true);
  const toggleShowToast = () => setShowToast(!showToast);

  useEffect(() => {
    (async () => {
      console.log({ nftResult });
      if (nftResult) {
        setNftData(nftResult);
      }
      if (modelResult) {
        setModelData(modelResult);
      }
    })();
  }, [nftResult, modelResult]);

  let nftListRender;

  if (nftData) {
    nftListRender = nftData
      .map((nft) => {
        if (nft.totw) return <NFTListItem key={nft.id} data={nft} />;
        else return undefined;
      })
      .filter((e) => e);
  } else {
    nftListRender = (
      <div className="w-100 d-flex justify-content-center align-items-center">
        <Spinner
          animation="border"
          role="status"
          size="xl"
          style={{ textAlign: "center" }}
        >
          <span className="sr-only">Loading...</span>
        </Spinner>
      </div>
    );
  }

  let modelListRender;

  if (modelData) {
    const mR = modelData
      .map((model) => {
        if (model)
          return (
            <div className="col-lg-4 col-md-6">
              <ModelListItem key={model.username} data={model} />
            </div>
          );
        else return undefined;
      })
      .filter((e) => e);

    modelListRender = (
      <div className="row flex justify-content-center">{mR}</div>
    );
  } else {
    modelListRender = (
      <div className="w-100 d-flex justify-content-center align-items-center">
        <Spinner
          animation="border"
          role="status"
          size="xl"
          style={{ textAlign: "center" }}
        >
          <span className="sr-only">Loading...</span>
        </Spinner>
      </div>
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
                <Scroll.Link
                  to="nft-list"
                  spy={true}
                  smooth={true}
                  offset={50}
                  duration={1000}
                >
                  <Button variant="primary py-2 w-100">
                    <b>BROWSE NFTs</b>
                  </Button>
                </Scroll.Link>
              </div>
              <div className="col-md-6 mt-2">
                <a
                  href="https://exchange.pancakeswap.finance/#/swap?outputCurrency=0xac0c7d9b063ed2c0946982ddb378e03886c064e6"
                  target="_blank"
                >
                  <Button variant="light w-100 py-2 text-primary">
                    <b>INDULGE IN A $TREAT</b>
                  </Button>
                </a>
              </div>
            </div>
          </div>
          <div className="col-lg-1"></div>
          <div className="col-lg-5 hero-logo-container mt-5 d-lg-flex d-none">
            <img src={"/assets/hero-logo.png"} alt="" />
          </div>
        </div>
      </div>
      <Scroll.Element name="model-list">
        <div
          className="heading-text p-0 mb-4 text-center"
          style={{ fontSize: "3em" }}
        >
          Treats of the Week
        </div>
        <div className="nft-list">{modelListRender}</div>
      </Scroll.Element>
      <Scroll.Element name="nft-list ">
        <div
          className="heading-text p-0 mt-5 mb-4 text-center"
          style={{ fontSize: "3em" }}
        >
          All Available NFTs
        </div>
        <div className="nft-list">{nftListRender}</div>
      </Scroll.Element>
    </div>
  );
};

export default Home;
