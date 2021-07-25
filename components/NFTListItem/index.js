import React, { useState, useEffect } from "react";
import { generateFromString } from "generate-avatar";
import { Blurhash } from "react-blurhash";
import { EyeSlash } from "react-bootstrap-icons";
import { motion } from "framer-motion";

let easing = [0.175, 0.85, 0.42, 0.96];

const variants = {
  initial: {
    y: 150,
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
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.2,
      ease: easing,
    },
  },
};

const NFTListItem = ({ data }) => {
  const [image, setBase64Image] = useState();
  console.log({ data });

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
    <motion.div variants={variants}>
      <a href={`/view/${data.id}`}>
        <div className="nft-card">
          <div className="totw-tag-wrapper">
            {data.totw && <div className="totw-tag">TOTW</div>}
          </div>
          <div className="profile-pic">
            <img
              src={
                data.model_profile_pic ||
                `data:image/svg+xml;utf8,${generateFromString(
                  data.attributes[0].value
                )}`
              }
            />
          </div>
          <div className="img-container text-center text-lg-left d-flex justify-content-center align-items-center">
            <div className="info-overlay">
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
              height={400}
              resolutionX={32}
              resolutionY={32}
              punch={1}
            />
          </div>
          <div className="text-container container">
            <div className="title-section">
              {/* <div className="edition">AVAILABLE THIS WEEK ONLY</div> */}
              {/* <div className="edition">MAX SUPPLY {data.max_supply}</div> */}
              <div className="title">{data.name}</div>
              <div className="name">{data.attributes[0].value}</div>
            </div>
            <div className="stats">
              <div className="stat">
                <div className="number">{data.list_price}</div>
                <div className="label">BNB</div>
              </div>
              {/* <div className="stat">
                <div className="label">CREATOR SHARE</div>
                <div className="number">75%</div>
              </div> */}
            </div>
            {/* <div className="bottom-container">
            <div className="creator">
              <div className="details">
                <div className="label">CREATOR</div>
                <div className="name">{data.attributes[0].value}</div>
              </div>
            </div>
          </div> */}
          </div>
        </div>
      </a>
    </motion.div>
  );
};

export default NFTListItem;
