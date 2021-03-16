import React, { useState } from "react";
import Button from "react-bootstrap/Button";

// import blur from "/assets/blur.png";
// import "./index.scss";

const NFTListItem = ({ data }) => {
  return (
    <a href="/view">
      <div className="container">
        <div className="nft-list-item row">
          <div className="col-lg-3 img-container text-center text-lg-left">
            <img src={data.placeholder_image || "/assets/blur.png"} />
          </div>
          <div className="col-lg-9 text-container container p-3 pt-5 pl-xl-0 pl-lg-3 px-lg-0 pt-lg-2">
            <div className="title-section">
              <div className="edition">EDITION {data.edition}</div>
              <div className="title">{data.name}</div>
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
            <div className="bottom-container">
              <div className="creator">
                <div className="pic">
                  <img src={data.creator.profile_pic} />
                </div>
                <div className="details">
                  <div className="label">CREATOR</div>
                  <div className="name">{data.creator.name}</div>
                </div>
              </div>
              <div className="button pt-4 pt-md-0 ">
                <Button variant="primary py-2 px-5 mr-3 w-sm-100">
                  <b>VIEW NFT</b>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </a>
  );
};

export default NFTListItem;
