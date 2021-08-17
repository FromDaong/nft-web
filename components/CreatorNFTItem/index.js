import React, { useState, useEffect } from "react";
import Spinner from "react-bootstrap/Spinner";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { Blurhash } from "react-blurhash";
import { motion } from "framer-motion";
import { EyeSlash } from "react-bootstrap-icons";
import Link from "next/link";

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

const CreatorNFTItem = ({
  data,
  revealNFTs,
  modelData,
  isLoading,
  balance,
  price,
}) => {
  const [image, setBase64Image] = useState();
  const [modalData, setModalData] = useState();

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

  console.log({ modelData });

  return (
    <>
      <Modal
        size="lg"
        show={modalData ? true : false}
        onHide={() => setModalData(null)}
        aria-labelledby="example-modal-sizes-title-lg"
      >
        <Modal.Body>
          <div
            className="modal-image"
            style={{ background: `url(${image})` }}
          ></div>
        </Modal.Body>
        <Modal.Footer>
          <div className="container text-center">
            <Button onClick={() => setModalData(null)}>Close</Button>
          </div>
        </Modal.Footer>
      </Modal>

      <motion.div variants={variants}>
        <Link href={`/view/${data.id}`}>
          <div className="nft-card" style={{ boxShadow: "none" }}>
            <div className="totw-tag-wrapper">
              {balance > 1 && (
                <div className="quantity-wrapper totw-tag">
                  Contains {balance}x
                </div>
              )}
            </div>
            <div className="profile-pic">
              <Link href={`/creator/${modelData.username}`}>
                <img
                  src={
                    modelData.profile_pic ||
                    `data:image/svg+xml;utf8,${generateFromString(
                      data.attributes[0].value
                    )}`
                  }
                />
              </Link>
            </div>
            <div
              className="img-container text-center text-lg-left d-flex justify-content-center align-items-center"
              style={{
                background: "black",
                border: "3px solid #E795B6",
                borderRadius: 10,
                minHeight: 300,
              }}
            >
              {data.image ? (
                image ? (
                  <div
                    style={{ background: `url(${data.image})` }}
                    className="dynamic-image"
                  />
                ) : (
                  <Spinner
                    animation="border"
                    role="status"
                    className="mt-5 mb-5"
                    variant="light"
                  >
                    <span className="sr-only">Loading...</span>
                  </Spinner>
                )
              ) : isLoading ? (
                <Spinner
                  animation="border"
                  role="status"
                  className="mt-5 mb-5"
                  variant="light"
                >
                  <span className="sr-only">Loading...</span>
                </Spinner>
              ) : (
                <>
                  <div className="info-overlay">
                    <EyeSlash size={32} />
                    <div className="pt-1">Click to Reveal</div>
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
                </>
              )}
            </div>
            <div className="text-container container">
              <div className="title-section">
                <div className="title">{data.name}</div>
                <div className="name">{data.attributes[0].value}</div>
              </div>
              <div className="stats">
                <div className="stat">
                  <div className="number">{data.list_price}</div>
                  <div className="label">BNB</div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-12 mt-3">
                <span className="d-inline-block w-100">
                  <Button className="w-100" variant="secondary" disabled>
                    <b>Edit NFT</b>
                  </Button>
                </span>
              </div>
            </div>
          </div>
        </Link>
      </motion.div>
    </>
  );
};

export default CreatorNFTItem;
