import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Button from "react-bootstrap/Button";
import Link from "next/link";

let easing = [0.175, 0.85, 0.42, 0.96];

const variants = {
  initial: {
    y: 150,
    opacity: 0,
  },
  hidden: {
    opacity: 0,
    y: 150,
    transition: {
      duration: 0.1,
      ease: easing,
    },
  },
  show: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: easing,
    },
  },
};

const CreatingNFTItemPreview = ({
  data,
  imageUrl,
  buttonLabel,
  buttonFunction,
  isOwner,
  price,
  name,
  owner,
  quantity,
  disableAnimations,
  modelData,
}) => {
  const [image, setBase64Image] = useState();
  console.log({ data });

  useEffect(() => {
    (async () => {
      // if (data.image) {
      //   fetch(data.image)
      //     .then((r) => r.text())
      //     .then((blob) => {
      //       setBase64Image(blob.replace(`"`, "").replace(/["']/g, ""));
      //     });
      // }
    })();
  }, [data]);

  return (
    <motion.div variants={disableAnimations ? {} : variants} layout>
      <div className="nft-card m-0">
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
        <Link href={`/creator/${modelData.username}`}>
          <div className="profile-pic">
            <img src={modelData.profile_pic} />
          </div>
        </Link>
        <div className="img-container text-center text-lg-left d-flex justify-content-center align-items-center">
          <div
            style={{ background: `url(${imageUrl})`, backgroundColor: "#333" }}
            className="dynamic-image"
          />
          {/* <div className="info-overlay">
              <EyeSlash size={32} />
              <div>Purchase to View</div>
            </div>
            <Blurhash
              style={{
                borderRadius: 8,
                overflow: "hidden",
                border: "3px solid #E795B6",
              }}
              hash={data.blurhash}
              width={"100%"}
              height={375}
              resolutionX={32}
              resolutionY={32}
              punch={1}
            /> */}
        </div>
        <div className="text-container container">
          <div className="title-section">
            <div className="title">{name}</div>
            <div className="name">
              {modelData.username && <b>Creator: </b>}
              {modelData.username}
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
              <div className="number">{price}</div>
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
    </motion.div>
  );
};

export default CreatingNFTItemPreview;
