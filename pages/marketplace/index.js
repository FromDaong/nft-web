import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Layout from "../../components/Layout";
import Link from "next/link";
import * as Scroll from "react-scroll";

const Home = () => {
  return (
    <Layout>
      <div
        className="home container d-flex justify-content-center align-items-center"
        style={{ minHeight: "70vh" }}
      >
        <Scroll.Element name="marketplace-list">
          <div className="pink-bg mb-5 mt-5 text-center">
            <img
              src={"/assets/transfer.png"}
              className="w-100 pt-3"
              alt=""
              style={{ maxWidth: 250 }}
            />
            <div
              className="heading-text p-0 pt-2"
              style={{ fontSize: "3.5em" }}
            >
              Treat Marketplaces
            </div>
            <p
              className="totw-secondary-text m-0 pt-2 pb-0 mb-2"
              style={{ lineHeight: 1.75, margin: "auto !important" }}
            >
              <b style={{ fontSize: "1.3em" }}>
                We now have 2 public marketplaces on TreatDAO!
              </b>
            </p>
            <p
              className="totw-secondary-text m-0 pt-2 pb-3"
              style={{ lineHeight: 1.75, margin: "auto !important" }}
            >
              <b>1. "Creator Marketplace"</b> where you can buy NFTs directly
              from models and performers.
              <br />
              <b>2. "Resale Marketplace"</b> where you can buy and sell minted
              Treat NFTs on a second-hand market.
            </p>

            <div className="buttons">
              <Link href="/marketplace/creator">
                <Button
                  variant="primary mt-3 py-2 w-100"
                  style={{ maxWidth: 250 }}
                >
                  <b>CREATOR MARKETPLACE</b>
                </Button>
              </Link>
              <Link href="/marketplace/resale">
                <Button
                  variant="secondary mt-3 py-2 w-100 ml-3"
                  style={{ maxWidth: 250 }}
                >
                  <b>RESALE MARKETPLACE</b>
                </Button>
              </Link>
            </div>
          </div>
        </Scroll.Element>
      </div>
    </Layout>
  );
};

export default Home;
