import React, { useState, useEffect } from "react";
import Spinner from "react-bootstrap/Spinner";
import Button from "react-bootstrap/Button";
import { generateFromString } from "generate-avatar";

// import blur from "/assets/blur.png";
// import "./index.scss";

const NFTListItem = ({ data }) => {
  const [image, setBase64Image] = useState();

  useEffect(() => {
    (async () => {
      if (data.image) {
        fetch(data.image)
          .then((r) => r.text())
          .then((blob) => {
            setBase64Image(blob.replace(`"`, "").replace(/["']/g, ""));
          });
      }
    })();
  }, [data]);

  return (
    <a href={`/view/${data.id}`}>
      <div className="container">
        <div className="nft-list-item row">
          <div className="col-lg-3 img-container text-center text-lg-left d-flex justify-content-center align-items-center">
            {image ? (
              <img src={image} />
            ) : (
              <Spinner animation="border" role="status" className="mt-5 mb-5">
                <span className="sr-only">Loading...</span>
              </Spinner>
            )}
          </div>
          <div className="col-lg-9 text-container container p-3 pt-5 pl-xl-0 pl-lg-3 px-lg-0 pt-lg-2">
            <div className="title-section">
              <div className="edition">MAX SUPPLY {data.max_supply}</div>
              <div className="title">{data.name}</div>
            </div>
            <div className="stats">
              <div className="stat">
                <div className="label">LIST PRICE</div>
                <div className="number">{data.list_price} BNB</div>
              </div>
              <div className="stat">
                <div className="label">CREATOR SHARE</div>
                <div className="number">80%</div>
              </div>
            </div>
            <div className="bottom-container">
              <div className="creator">
                <div className="pic">
                  <img
                    src={`data:image/svg+xml;utf8,${generateFromString(
                      data.attributes[0].value
                    )}`}
                    style={{ filter: "saturate(0)" }}
                  />
                </div>
                <div className="details">
                  <div className="label">CREATOR</div>
                  <div className="name">{data.attributes[0].value}</div>
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
