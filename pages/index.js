import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import TotwListItem from "../components/TotwListItem";
import CreatorList from "../components/CreatorList";
import SwiperNFTList from "../components/SwiperNFTList";
import Layout from "../components/Layout";
import Link from "next/link";
import CountUp from "react-countup";
import * as Scroll from "react-scroll";
import {
  PatchCheckFill,
  PlusCircleFill,
  ShopWindow,
  EaselFill,
} from "react-bootstrap-icons";
import ErrorFallback from "../components/Fallback/Error";
import { axiosNode } from "../utils/axios";

const Home = ({
  modelsResults,
  nftData,
  totm,
  nftResultError,
  modelResultError,
  totmError,
}) => {
  let modelData = modelsResults;
  return (
    <Layout>
      <div className="home container">
        <div className="min-height-wrapper">
          <div className="hero">
            <div className="row align-items-center">
              <div className="col-lg-6 hero-text mt-3">
                <div className="heading-text">
                  It's time to <br />
                  treat yourself...
                </div>
                <div className="secondary-text">
                  <b style={{ fontSize: "1.1em" }}>
                    Treat is an open platform for creators to curate their adult
                    content as NFTs.
                  </b>
                  <br />
                  <br />
                  Hold the $TREAT token to have a say in the future of the only
                  NSFW platform that focuses on decentralization first and
                  foremost
                </div>
                <div className="buttons row pt-4" style={{ maxWidth: 500 }}>
                  <div className="col-md-6  mt-2">
                    <Scroll.Link
                      to="marketplace-list"
                      spy={true}
                      smooth={true}
                      offset={50}
                      duration={1000}
                    >
                      <Button variant="primary w-100 py-2">
                        <b>View Marketplaces</b>
                      </Button>
                    </Scroll.Link>
                  </div>
                  <div className="col-md-6 mt-2">
                    <a
                      href="https://pancakeswap.finance/swap?inputCurrency=0x01bd7acb6ff3b6dd5aefa05cf085f2104f3fc53f"
                      target="_blank"
                    >
                      <Button variant="light w-100 py-2">
                        <b>Buy $TREAT</b>
                      </Button>
                    </a>
                  </div>
                </div>
                <div className="stats row mt-5">
                  <div className="col-md-6 stat-container">
                    <div className="big-text">
                      <CountUp
                        delay={1}
                        duration={2}
                        end={2000}
                        separator={","}
                      />
                      +
                    </div>
                    <div className="small-text">
                      NFTs listed by{" "}
                      <CountUp delay={1} duration={1} end={450} />+ creators
                    </div>
                  </div>
                  <div className="col-md-6 stat-container">
                    <div className="big-text">
                      <CountUp
                        delay={1}
                        duration={2}
                        end={30000}
                        separator={","}
                      />
                      +
                    </div>
                    <div className="small-text">NFTs Sold</div>
                  </div>
                </div>
              </div>
              <div className="col-lg-1"></div>
              <div className="col-lg-5 hero-logo-container mt-5 d-lg-flex d-none">
                <img src={"/assets/heroimage.png"} alt="" />
              </div>
            </div>
          </div>
        </div>
        <div className="totw-section-container mt-5">
          <div className="section-title">Treat of the Month</div>
          <div className="desc">
            TOTM is a curated showcase of creators. We assist the chosen
            creators in presenting a unique set of content exclusive to
            TreatDAO.
          </div>
          <Link href="/magazine">
            <Button variant="info py-2 px-4 mt-3 mb-3">
              <b>View Treat Magazine</b>
            </Button>
          </Link>

          <a
            href="https://opensea.io/collection/treatofthemonth"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-4"
          >
            <Button variant="py-2 px-4 mt-3 mb-3">
              <b style={{ color: "#8349CC" }}>View Ethereum Collection</b>
            </Button>
          </a>

          {totm && !modelResultError ? (
            <TotwListItem modelData={totm} />
          ) : (
            <ErrorFallback custom="Failed to load TOTW" />
          )}
        </div>
        <Scroll.Element name="marketplace-list">
          <div className="how-it-works mt-4 mb-5">
            <div className="heading">How it works</div>
            <div className="main-section row">
              <div className="step col-md-4">
                <div className="icon">
                  <PatchCheckFill size={64} color={"#eb518a"} />
                </div>
                <div className="title" style={{ color: "#eb518a" }}>
                  Verify Creators
                </div>
                <div className="desc">
                  We use industry leading identity verification technology to
                  make sure our creators are who they say they are, and are able
                  to consent to using TreatDAO
                </div>
              </div>
              <div className="step col-md-4">
                <div className="icon">
                  <PlusCircleFill size={64} color={"#7736c8"} />
                </div>
                <div className="title" style={{ color: "#7736c8" }}>
                  Mint new NFTs
                </div>
                <div className="desc">
                  Use our in-house NFT minter, where you can convert photos into
                  Treat NFTs to be sold on our public creator marketplace which
                  we call: “The Sweet Shop”
                </div>
              </div>
              <div className="step col-md-4">
                <div className="icon">
                  <ShopWindow size={64} color={"#EF6B67"} />
                </div>
                <div className="title" style={{ color: "#EF6B67" }}>
                  Resale Marketplace
                </div>
                <div className="desc">
                  List your NFTs publicly on our resale marketplace for others
                  to purchase. Blurred NFTs' hidden images are only viewable by
                  their owner.
                </div>
              </div>
            </div>
          </div>
          <br />
          <div className="pink-bg mb-5 mt-4 row d-flex align-items-center marketplace-section">
            <div className="col-md-1"></div>
            <div className="col-md-4">
              <img src={"/assets/transfer.png"} className="w-100 pt-3" alt="" />
            </div>
            <div className="col-md-1"></div>

            <div className="col-md-6">
              <div className="in-house">Our in house</div>
              <div className="heading p-0" style={{ fontSize: "3.5em" }}>
                Marketplaces
              </div>
              <p className="marketplace-buttons-container pt-4">
                <Link href="/marketplace/creator">
                  <a>
                    <div className="marketplace-button">
                      <div className="icon">
                        <EaselFill size={48} />
                      </div>
                      <div className="content">
                        <div className="title">The Sweet Shop</div>
                        <div className="description">
                          Find and buy NFTs directly from models, photographers
                          and performers. Verified creators can create NFTs
                          freely on this marketplace.
                        </div>
                      </div>
                    </div>
                  </a>
                </Link>
                <Link href="/marketplace/resale">
                  <a>
                    <div className="marketplace-button orange">
                      <div className="icon">
                        <ShopWindow size={48} />
                      </div>
                      <div className="content">
                        <div className="title">Resale Marketplace</div>
                        <div className="description">
                          Buy and sell minted Treat NFTs on the official
                          aftermarket. Find sold out NFTs here, as well as
                          exclusive NFTs bought from a creator’s subscription.
                        </div>
                      </div>
                    </div>
                  </a>
                </Link>
              </p>
            </div>
          </div>
          <br />
        </Scroll.Element>
        {!nftResultError ? (
          <SwiperNFTList nftData={nftData} />
        ) : (
          <ErrorFallback custom="Failed to load NFTs" />
        )}
        <br />
        <CreatorList modelData={modelData} />
      </div>
    </Layout>
  );
};

export default Home;

export const getServerSideProps = async () => {
  const totmFetch = await axiosNode.get("/api/model?totm=true");
  let totm = totmFetch.data.docs.length > 0 ? totmFetch.data.docs[0] : null;
  const totmError = !totm ? true : false;

  const nftFetch = await axiosNode.get("/api/nft?limit=20");
  let nftData = nftFetch.data.docs;
  const nftError = !nftData ? true : false;

  const modelFetch = await axiosNode.get("/api/model");
  let modelsResults = modelFetch.data.docs;
  const modelError = !modelsResults ? true : false;

  console.log({ modelsResults });

  return {
    props: {
      totm,
      totmError,
      nftData,
      nftError,
      modelsResults,
      modelError,
    },
  };
};
