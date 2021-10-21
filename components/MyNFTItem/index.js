import React, { useState, useEffect } from "react";
import Spinner from "react-bootstrap/Spinner";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { Blurhash } from "react-blurhash";
import { isBlurhashValid } from "blurhash";
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

const NFTListItem = ({
  data,
  revealNFTs,
  transferNFTClick,
  listOrderClick,
  cancelOrderClick,
  isLoading,
  balance,
  price,
  hasOpenOrder,
}) => {
  const [image, setBase64Image] = useState();
  const [modalData, setModalData] = useState();
  var base64regex =
    /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;

  useEffect(() => {
    (async () => {
      if (data.image && data.old_totw) {
        fetch(data.image)
          .then((r) => r.text())
          .then((blob) => {
            const replacedText = blob.replace(`"`, "").replace(/["']/g, "");
            console.log(base64regex.test(replacedText));
            setBase64Image(replacedText);
          });
      }
    })();
  }, [data]);

  console.log({ image, data });

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
          <h4 className="text-center pt-3">{data.description}</h4>
        </Modal.Body>
        <Modal.Footer>
          <div className="container text-center">
            <Button onClick={() => setModalData(null)}>Close</Button>
          </div>
        </Modal.Footer>
      </Modal>

      <motion.div variants={variants}>
        <div className="nft-card" style={{ boxShadow: "none" }}>
          <div className="totw-tag-wrapper">
            {balance > 1 && (
              <div className="quantity-wrapper totw-tag">
                {balance}x Available
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
            onClick={() => {
              if (image) {
                setModalData(true);
              } else {
                revealNFTs();
              }
            }}
          >
            {data.image || isLoading ? (
              <>
                <div
                  style={{
                    position: "absolute",
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Spinner
                    animation="border"
                    role="status"
                    className="mt-5 mb-5"
                    variant="light"
                  >
                    <span className="sr-only">Loading...</span>
                  </Spinner>
                </div>
                <div
                  style={{
                    background: `url(${image || data.image})`,
                    minHeight: 375,
                    zIndex: 100,
                  }}
                  className="dynamic-image"
                />
              </>
            ) : (
              <>
                <div className="info-overlay">
                  <EyeSlash size={32} />
                  <div className="pt-1">Click to Reveal</div>
                </div>
                {isBlurhashValid(data.blurhash) && data.blurhash.length > 5 ? (
                  <Blurhash
                    style={{ borderRadius: 5, overflow: "hidden" }}
                    hash={data.blurhash}
                    width={"100%"}
                    height={300}
                    resolutionX={32}
                    resolutionY={32}
                    punch={1}
                  />
                ) : (
                  <h3 className="text-center p4">
                    Please contaact admin. Invalid Blurhash.
                  </h3>
                )}
              </>
            )}
          </div>
          <div className="text-container container">
            <div className="title-section">
              <div className="title">{data.name}</div>
              <div className="name">{data.attributes[0].value}</div>
            </div>
            <div className="stats">
              {price && (
                <div className="stat">
                  <div className="number">{price}</div>
                  <div className="label">BNB</div>
                </div>
              )}
            </div>
          </div>

          {!!transferNFTClick ? (
            <div className="row">
              <div className="col-lg-6 mt-3">
                <span className="d-inline-block w-100">
                  <OverlayTrigger
                    placement="top"
                    overlay={
                      <Tooltip id="tooltip-disabled">
                        You must list the same NFTs together.
                      </Tooltip>
                    }
                  >
                    <span>
                      <Button
                        className="w-100"
                        variant="secondary"
                        disabled={hasOpenOrder}
                        style={hasOpenOrder ? { pointerEvents: "none" } : {}}
                        onClick={() => listOrderClick({ ...data, balance })}
                      >
                        <b>Re-Sell</b>
                      </Button>
                    </span>
                  </OverlayTrigger>
                </span>
              </div>
              <div className="col-lg-6 mt-3">
                <span className="d-inline-block w-100">
                  <Button
                    className="w-100"
                    variant="secondary"
                    onClick={() => transferNFTClick(data)}
                  >
                    <b>Transfer</b>
                  </Button>
                </span>
              </div>
            </div>
          ) : (
            <div className="row">
              <div className="col-lg-12 mt-3">
                <span className="d-inline-block w-100">
                  <Button
                    className="w-100"
                    variant="secondary"
                    onClick={() => cancelOrderClick(data)}
                  >
                    <b>Remove Your Listing</b>
                  </Button>
                </span>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </>
  );
};

export default NFTListItem;
