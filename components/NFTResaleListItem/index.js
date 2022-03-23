import React, { useEffect, useState } from "react";

import { Blurhash } from "react-blurhash";
import { Button } from "@chakra-ui/react";
import { EyeSlash } from "react-bootstrap-icons";
import { generateFromString } from "generate-avatar";
import useGetOpenOrdersForNft from "../../hooks/useGetOpenOrdersForNft";

const NFTResaleListItem = ({ data }) => {
  const [image, setBase64Image] = useState();

  const orders = useGetOpenOrdersForNft(data.id);

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
    <div className="container">
      <div className="nft-list-item row">
        <div className="col-lg-3 img-container text-center text-lg-left d-flex justify-content-center align-items-center ">
          <div className="info-overlay">
            <EyeSlash size={32} />
            <div>Purchase to View</div>
          </div>
          <Blurhash
            style={{ borderRadius: 5, overflow: "hidden" }}
            hash={data.blurhash}
            width={"100%"}
            height={300}
            resolutionX={32}
            resolutionY={32}
            punch={1}
          />
        </div>
        <div className="col-lg-9 text-container container p-3 pt-5 pl-xl-4 pl-lg-5 px-lg-0 pt-lg-2">
          <div className="title-section">
            <div className="edition">TITLE HERE</div>
            <div className="edition">SUPPLY: {data.maxSupply}</div>
            <div className="title">{data.name}</div>
          </div>
          <div className="stats">
            <div className="stat">
              <div className="label">ORIGINAL LIST PRICE</div>
              <div className="number">{data.list_price} BNB</div>
            </div>
          </div>
          <div className="bottom-container">
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
            <div className="button pt-4 pt-md-0 ">
              {!!orders && orders.length > 0 && (
                <a href={`/marketplace/${data.id}`}>
                  <Button>
                    <b>MARKETPLACE</b>
                  </Button>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NFTResaleListItem;
