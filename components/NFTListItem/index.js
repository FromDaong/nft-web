import React, { useState, useEffect } from "react";
import { generateFromString } from "generate-avatar";
import { Blurhash } from "react-blurhash";
import { EyeSlash } from "react-bootstrap-icons";
import { motion } from "framer-motion";
import Spinner from "react-bootstrap/Spinner";
import Button from "react-bootstrap/Button";
import Link from "next/link";

let easing = [0.175, 0.85, 0.42, 0.96];

const variants = {
  initial: {
    opacity: 0,
  },
  hidden: {
    opacity: 0,
    transition: {
      duration: 0.1,
      ease: easing,
    },
  },
  show: {
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: easing,
    },
  },
};

const NFTListItem = ({
  data,
  buttonLabel,
  buttonFunction,
  isOwner,
  price,
  owner,
  quantity,
  disableAnimations,
  modelData,
}) => {
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

  if (!data.attributes) return <div></div>;

  return (
    <motion.div variants={disableAnimations ? {} : variants} layout>
      <Link href={`/view/${data.id}`}>
        <div className="nft-card">
          <div className="totw-tag-wrapper">
            {isOwner ? (
              <div className="totw-tag">MY NFT</div>
            ) : (
              data.totw && <div className="totw-tag">TOTW</div>
            )}
            {quantity > 1 && (
              <div className="quantity-wrapper totw-tag">
                {quantity}x Available
              </div>
            )}
          </div>
          <Link href={`/creator/${data.attributes[0].value.replace("@", "")}`}>
            <div
              className="profile-pic"
              style={{ backgroundImage: `url(${data.model_profile_pic})` }}
            />
          </Link>
          <div
            className="img-container text-center text-lg-left d-flex justify-content-center align-items-center"
            style={{
              background: "black",
              border: "3px solid #E795B6",
              borderRadius: 10,
              minHeight: 300,
            }}
          >
            <Spinner
              animation="border"
              role="status"
              className="mt-5 mb-5"
              style={{ position: "absolute", margin: "auto", zIndex: 1 }}
              variant="light"
            >
              <span className="sr-only">Loading...</span>
            </Spinner>
            {data.image ? (
              <div
                style={{
                  background: `url(${data.image})`,
                  minHeight: 375,
                  zIndex: 100,
                }}
                className="dynamic-image"
              />
            ) : (
              <>
                <div className="info-overlay" style={{ zIndex: 100 }}>
                  <EyeSlash size={32} />
                  <div>Purchase to View</div>
                </div>
                <Blurhash
                  style={{
                    borderRadius: 8,
                    overflow: "hidden",
                    zIndex: 95,
                  }}
                  hash={data.blurhash}
                  width={"100%"}
                  height={375}
                  resolutionX={32}
                  resolutionY={32}
                  punch={1}
                />
              </>
            )}
          </div>
          <div className="text-container container">
            <div className="title-section">
              <div className="title">{data.name}</div>
              <div className="s">
                {owner && <b>Creator: </b>}
                {data.attributes[0].value}
              </div>
              {owner && (
                <div className="name">
                  <b>Owner: </b>
                  {owner.slice(0, 6) + "..." + owner.slice(-6)}
                </div>
              )}
            </div>
            <div className="stats">
              <div className="stat">
                <div className="number">{price || data.list_price}</div>
                <div className="label">BNB</div>
              </div>
            </div>
          </div>
          {buttonLabel && buttonFunction && (
            <div className="row">
              <div className="col-lg-12 mt-3">
                <span className="d-inline-block w-100">
                  <Button
                    className="w-100"
                    variant="secondary"
                    onClick={buttonFunction}
                  >
                    <b className="d-flex align-items-center justify-content-center">
                      {buttonLabel}
                    </b>
                  </Button>
                </span>
              </div>
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
};

export default NFTListItem;
