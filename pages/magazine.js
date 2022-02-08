import React from "react";
import Hero from "../components/Hero";
import Gallery from "../components/Gallery";
import Link from "next/link";
import Button from "react-bootstrap/Button";

const Totm = () => {
  return (
    <div>
      <center>
        <Hero
          title={"Treat Magazine"}
          titleClass="primary"
          subtitle="A curated publication by Treat DAO featuring one creator each month"
          additionalContent={
            <div>
              <a
                href="https://opensea.io/collection/treatofthemonth"
                target="_blank"
                rel="noopener noreferrer"
              >
                <a>
                  <Button variant="primary w-sm-100">
                    <b>{"Visit the Ethereum Collection"}</b>
                  </Button>
                </a>
              </a>
            </div>
          }
        />
        <div>
          <Gallery />
        </div>
      </center>
    </div>
  );
};

export default Totm;