import React, { useState } from "react";
import Button from "react-bootstrap/Button";
// import HeroLogo from "/assets/hero-logo.png";

const About = () => {
  return (
    <div className="about">
      <div className="hero">
        <div className="row d-flex align-items-center">
          <div className="col-lg-6 hero-text">
            <div className="heading-text">
              Maybe it's time to treat yourself...
            </div>
          </div>
          <div className="col-lg-1"></div>
          <div className="col-lg-5 hero-logo-container mt-5">
            <img src={"/assets/hero-logo.png"} alt="" />
          </div>
        </div>
      </div>
      <div className="white-container p-4">
        <div className="secondary-text">
          Treat is an exclusive platform for models to sell NFTs. Hold $TREAT to
          have a say on which models are chosen & new platform features.
        </div>
        {/* <div className="buttons row pt-4">
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
        </div> */}
      </div>
    </div>
  );
};

export default About;
