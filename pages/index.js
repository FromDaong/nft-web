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
      .sort((a, b) => a.list_price - b.list_price)
      .map((nft) => {
        if (nft.totw)
          return (
            <div className="col-md-4">
              <NFTListItem key={nft.id} data={nft} />
            </div>
          );
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
        if (model && model.totw)
          return <ModelListItem key={model.username} data={model} />;
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
      <div className="min-height-wrapper">
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
                    <Button variant="light w-100 py-2">
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
        <div className="stats-components-wrapper row">
          <div className="col-lg-4 stats-wrapper">
            <div className="stats-container" style={{ background: "#D3678E" }}>
              <div className="big-text">10+</div>
              <div className="small-text">Creators on TreatDAO</div>
            </div>
          </div>
          <div className="col-lg-4 stats-wrapper">
            <div className="stats-container">
              <div className="big-text">65+ NFTs</div>
              <div className="small-text">Released on TreatDAO</div>
            </div>
          </div>
          <div className="col-lg-4 stats-wrapper">
            <div className="stats-container" style={{ background: "#F19592" }}>
              <div className="big-text">90+ BNB</div>
              <div className="small-text">Earned by Creators</div>
            </div>
          </div>
        </div>
      </div>
      <Scroll.Element name="model-list">
        <div className="row totw-section my-4">
          <div className="col-lg-8 d-flex flex-column justify-content-center">
            <div
              className="heavy-shadow p-0 mb-4 center-mobile"
              style={{ fontSize: "6.5em", lineHeight: 1.15 }}
            >
              Treat of
              <br />
              the Week
            </div>
            <p className="totw-secondary-text">
              "Treat of the Week" is the name we give to a featured creator from
              TreatDAO once a week. We choose a creator and work with them on a
              series of NFTs, which we feature on the homepage as well as all of
              our socials.
              <br />
              <br />
              To apply to become a model on TreatDAO or the “Treat of the Week”,
              fill in our short form.
            </p>
            <div className="totw-buttons">
              <a href="/apply">
                <Button variant="primary py-2 px-5 mt-4">
                  <b>Apply to Become a Creator</b>
                </Button>
              </a>
              <a href="/creators">
                <Button variant="light ml-md-4 py-2 px-5 mt-4">
                  <b>View All Creators</b>
                </Button>
              </a>
            </div>
          </div>
          <div className="col-lg-4">{modelListRender}</div>
        </div>
      </Scroll.Element>
      <Scroll.Element name="nft-list">
        <div
          className="heading-text p-0 mt-10 text-center"
          style={{ fontSize: "3em" }}
        >
          All Available NFTs
        </div>
        <p className="totw-secondary-text text-center m-auto pb-10 pt-1">
          These are all our currently available NFTs for purchase.
        </p>
        <div className="nft-list row mt-5">{nftListRender}</div>
      </Scroll.Element>
    </div>
  );
};

export default Home;
