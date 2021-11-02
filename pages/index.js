import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import NFTListItem from "../components/NFTListItem";
import ModelListItem from "../components/ModelListItem";
import SwiperNFTList from "../components/SwiperNFTList";
import Layout from "../components/Layout";
import { motion, useAnimation } from "framer-motion";
import Link from "next/link";
import useSWR from "swr";
import CountUp from "react-countup";
import * as Scroll from "react-scroll";
import { useInView } from "react-intersection-observer";
import {
  PatchCheckFill,
  PlusCircleFill,
  ShopWindow,
} from "react-bootstrap-icons";

const Home = () => {
  const { data: nftResult } = useSWR(`/api/nft`);
  const { data: modelResult } = useSWR(`/api/model`);
  const [nftData, setNftData] = useState();
  const [modelData, setModelData] = useState();
  const [ref, inView] = useInView();
  const controls = useAnimation();

  useEffect(() => {
    if (inView) {
      controls.start("show");
    }
  }, [controls, inView]);

  useEffect(() => {
    (async () => {
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
    nftListRender = (
      <motion.div
        className="nft-list row mt-5"
        animate={controls}
        exit="hidden"
        initial="hidden"
        ref={ref}
        variants={{
          show: { transition: { staggerChildren: 0.15 }, opacity: 1 },
          hidden: {
            transition: {
              staggerChildren: 0.02,
              staggerDirection: -1,
              when: "afterChildren",
            },
          },
        }}
      >
        {nftData
          .sort((a, b) => a.list_price - b.list_price)
          .map((nft) => {
            if (nft.totw)
              return (
                <div className="col-md-6 col-xl-4">
                  <NFTListItem key={nft.id} data={nft} />
                </div>
              );
            else return undefined;
          })
          .filter((e) => e)}
      </motion.div>
    );
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
          return (
            <div className="col-md-4">
              <ModelListItem
                key={model.username}
                data={model}
                disableAnim={true}
              />
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
    <Layout>
      <div className="home container">
        <div className="min-height-wrapper">
          <motion.div
            animate={{ x: 0, opacity: 1 }}
            style={{ x: -100, opacity: 0 }}
            className="hero"
          >
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
                      to="nft-list"
                      spy={true}
                      smooth={true}
                      offset={50}
                      duration={1000}
                    >
                      <Button variant="primary w-100 py-2">
                        <Link href="/marketplace">
                          <b>View Marketplaces</b>
                        </Link>
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
                      <CountUp delay={1} duration={2} end={600} />+
                    </div>
                    <div className="small-text">
                      NFTs listed by <CountUp delay={1} duration={1} end={80} />
                      + creators
                    </div>
                  </div>
                  <div className="col-md-6 stat-container">
                    <div className="big-text">
                      <CountUp delay={1} duration={2} end={250} />+
                    </div>
                    <div className="small-text">BNB in NFT transactions</div>
                  </div>
                </div>
              </div>
              <div className="col-lg-1"></div>
              <div className="col-lg-5 hero-logo-container mt-5 d-lg-flex d-none">
                <img src={"/assets/heroimage.png"} alt="" />
              </div>
            </div>
          </motion.div>
        </div>
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
                We use industry leading identity verification technology to make
                sure our creators are who they say they are, and are able to
                consent to using TreatDAO
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
                We use industry leading identity verification technology to make
                sure our creators are who they say they are, and are able to
                consent to using TreatDAO
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
                We use industry leading identity verification technology to make
                sure our creators are who they say they are, and are able to
                consent to using TreatDAO
              </div>
            </div>
          </div>
        </div>
        <SwiperNFTList />
        <br />
        <Scroll.Element name="model-list">
          <motion.div
            transition={{ delay: 1.5 }}
            animate={{ opacity: 1 }}
            style={{ opacity: 0 }}
            className="hero"
            className="row totw-section my-4"
          >
            <div className="col-lg-12 d-flex flex-column justify-content-center align-content-center text-center mb-4">
              <div
                className="heavy-shadow p-0 mb-2 center-mobile"
                style={{ fontSize: "5.5em", lineHeight: 1.15 }}
              >
                Trick or Treat of the Week
              </div>
              <p className="totw-secondary-text" style={{ maxWidth: "none" }}>
                Our Treat of the Week is a curated showcase of creators which
                are chosen by either TreatDAO or the community.
                <br />
                <br />
                We assist the chosen creators to have a unique set of content
                exclusive to TreatDAO and only available to purchase for one
                week. We feature the Treat of the Week on our homepage as well
                as all of our social media accounts.
                <br />
                <br />
                To apply to become a creator or to be considered for Treat of
                the Week, please use the button below
              </p>
              <div className="totw-buttons mb-4">
                <a href="/become-creator">
                  <Button variant="primary py-2 px-5 mt-4">
                    <b>Become a Creator</b>
                  </Button>
                </a>
                <a href="/creators">
                  <Button variant="light ml-md-4 py-2 px-5 mt-4">
                    <b>View All Creators</b>
                  </Button>
                </a>
              </div>
            </div>
            <div className="col-lg-12">{modelListRender}</div>
          </motion.div>
        </Scroll.Element>
        <br />
        <Scroll.Element name="nft-list">
          <motion.div
            animate={{ x: 0, opacity: 1 }}
            style={{ x: 100, opacity: 0 }}
            transition={{ delay: 1 }}
            className="p-0 mt-4 pink-bg"
          >
            <div className="heading-text" style={{ fontSize: "3em" }}>
              Current Treat of the Week NFTs
            </div>
            <p className="totw-secondary-text m-0">
              “Below is our current Treat of the Week creator(s) NFTs available
              for purchase. To view previous creators and purchase their
              content, please visit our{" "}
              <a
                href="/marketplace/resale"
                style={{ color: "inherit", textDecoration: "underline" }}
              >
                Resale Marketplace
              </a>
            </p>
          </motion.div>
          <div className="nft-list row">{nftListRender}</div>
        </Scroll.Element>
      </div>
    </Layout>
  );
};

export default Home;
