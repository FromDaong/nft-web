import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import NFTListItem from "../NFTListItem";
import ModelListItem from "../ModelListItem";
import useSWR from "swr";
import * as Scroll from "react-scroll";

const Hero = () => {
  return (
    <div className="hero">
      <div className="row">
        <div className="col-lg-6 hero-text">
          <div className="heading-text">
            Maybe it's time to treat yourself...
          </div>
          <div className="secondary-text">
            Treat is an exclusive platform for creators to sell NFTs. Hold
            $TREAT to have a say on which creators are chosen & new platform
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
                  <b>BUY $TREAT</b>
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
  );
};

const NftList = ({ totwOnly = false }) => {
  const { data: nftResult } = useSWR(`/api/nft`);
  const [nftData, setNftData] = useState();

  useEffect(() => {
    (async () => {
      if (nftResult) {
        setNftData(nftResult);
      }
    })();
  }, [nftResult]);

  let nftListRender;

  if (nftData) {
    nftListRender = nftData
      .sort((a, b) => a.list_price - b.list_price)
      .map((nft) =>
        totwOnly ? (
          nft.totw ? (
            <NFTListItem key={nft.id} data={nft} />
          ) : undefined
        ) : (
          <NFTListItem key={nft.id} data={nft} />
        )
      )
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

  return (
    <Scroll.Element name="nft-list ">
      <div
        className="heading-text p-0 mt-5 mb-4 text-center"
        style={{ fontSize: "3em" }}
      >
        All Available NFTs
      </div>
      <div className="nft-list">{nftListRender}</div>
    </Scroll.Element>
  );
};

const CreatorsNftList = () => {
  const { data: nftResult } = useSWR(`/api/nft`);
  const [nftData, setNftData] = useState();

  useEffect(() => {
    (async () => {
      if (nftResult) {
        setNftData(nftResult);
      }
    })();
  }, [nftResult]);

  let nftListRender;

  if (nftData) {
    nftListRender = nftData
      .sort((a, b) => a.list_price - b.list_price)
      .map((nft) => <NFTListItem key={nft.id} data={nft} />)
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

  return (
    <Scroll.Element name="nft-list ">
      <div
        className="heading-text p-0 mt-5 mb-4 text-center"
        style={{ fontSize: "3em" }}
      >
        All Available NFTs
      </div>
      <div className="nft-list">{nftListRender}</div>
    </Scroll.Element>
  );
};

const ModelList = ({ totwOnly = false }) => {
  const { data: modelResult } = useSWR(`/api/model`);
  const [modelData, setModelData] = useState();
  const [showToast, setShowToast] = useState(true);
  const toggleShowToast = () => setShowToast(!showToast);

  useEffect(() => {
    (async () => {
      if (modelResult) {
        setModelData(modelResult);
      }
    })();
  }, [modelResult]);

  let modelListRender;

  if (modelData) {
    const mR = modelData
      .map((model) =>
        totwOnly ? (
          model && model.totw ? (
            <div className="col-lg-4 col-md-6">
              <ModelListItem
                key={model.username}
                data={model}
                totwOnly={totwOnly}
              />
            </div>
          ) : undefined
        ) : (
          <div className="col-lg-4 col-md-6">
            <ModelListItem key={model.username} data={model} />
          </div>
        )
      )
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
    <Scroll.Element name="model-list">
      <div
        className="heading-text p-0 mb-4 text-center"
        style={{ fontSize: "3em" }}
      >
        {totwOnly ? "Treats of the Week" : "Creators"}
      </div>
      <div className="nft-list">{modelListRender}</div>
    </Scroll.Element>
  );
};

export const TreatsOfTheWeek = () => {
  return (
    <div className="home">
      <Hero />
      <ModelList totwOnly={true} />
      <NftList totwOnly={true} />
      {/* <CreatorsNftList /> */}
    </div>
  );
};

export default ModelList;
