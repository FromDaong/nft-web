import React, { useState, useEffect } from "react";
import Spinner from "react-bootstrap/Spinner";
import Button from "react-bootstrap/Button";
import { generateFromString } from "generate-avatar";

// import blur from "/assets/blur.png";

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
      <div className="my-nft-item row text-align-center px-3 pt-3 pb-2">
        <div className="text-container container p-3 pt-5 pl-xl-0 pl-lg-3 px-lg-0 pt-lg-2">
          <div className="title-section">
            {/* <div className="edition">MAX SUPPLY {data.max_supply}</div> */}
            <div className="title">{data.name}</div>
          </div>
          <div className="img-container text-center text-lg-left d-flex justify-content-center align-items-center">
            {image ? (
              <img src={image} />
            ) : (
              <Spinner animation="border" role="status" className="mt-5 mb-5">
                <span className="sr-only">Loading...</span>
              </Spinner>
            )}
          </div>
          <div className="creator">
            <div className="pic">
              <img
                src={
                  data.model_profile_pic ||
                  `data:image/svg+xml;utf8,${generateFromString(
                    data.attributes[0].value
                  )}`
                }
              />
            </div>
            <div className="details">
              <div className="label">CREATOR</div>
              <div className="name">{data.attributes[0].value}</div>
            </div>
          </div>
          {/* <div className="pt-4 pt-md-0 ">
            <Button variant="primary py-2 px-5 mr-3 w-sm-100">
              <b>VIEW NFT</b>
            </Button>
          </div> */}
        </div>
      </div>
    </a>
  );
};

export default NFTListItem;
