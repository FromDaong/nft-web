import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { Blurhash } from "react-blurhash";
import { isBlurhashValid } from "blurhash";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/router";

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

const CreatorNFTItem = ({ data, modelData, balance }) => {
  const [image, setBase64Image] = useState();
  const [modalData, setModalData] = useState();
  const router = useRouter();

  useEffect(() => {
    (async () => {
      if (data.image && data.old_totw) {
        fetch(data.image)
          .then((r) => r.text())
          .then((blob) => {
            setBase64Image(blob.replace(`"`, "").replace(/["']/g, ""));
          });
      } else if (data.image) {
        setBase64Image(data.image);
      }
    })();
  }, [data]);

  const goToEditNFT = (e) => {
    e.preventDefault(true);
    router.push(`/creator-dashboard/edit-nft/${data.id}`);
  };

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

      <div variants={variants}>
        <Link href={`/view/${data.id}`}>
          <a>
            <div className="nft-card" style={{ boxShadow: "none" }}>
              <div className="totw-tag-wrapper">
                {balance > 1 && (
                  <div className="quantity-wrapper totw-tag">
                    {balance}x Available
                  </div>
                )}
              </div>

              <Link href={`/creator/${modelData.username}`}>
                <a>
                  <div
                    className="profile-pic"
                    style={{
                      background: `url(${model.profilePicCdnUrl}-/quality/lightest/-/format/webp/)`,
                    }}
                  ></div>
                </a>
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
                {data.image ? (
                  <div
                    style={{ background: `url(${image})`, minHeight: 375 }}
                    className="dynamic-image"
                  />
                ) : isBlurhashValid(data.blurhash).result ? (
                  <>
                    <Blurhash
                      style={{
                        borderRadius: 8,
                        overflow: "hidden",
                      }}
                      hash={data.blurhash}
                      width={"100%"}
                      height={375}
                      resolutionX={32}
                      resolutionY={32}
                      punch={1}
                    />
                  </>
                ) : (
                  <h3 className="text-center p4">
                    Please contaact admin. Invalid Blurhash.
                  </h3>
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
                    <Button
                      className="w-100"
                      variant="secondary"
                      onClick={goToEditNFT}
                    >
                      <b>Edit NFT</b>
                    </Button>
                  </span>
                </div>
              </div>
            </div>
          </a>
        </Link>
      </div>
    </>
  );
};

export default CreatorNFTItem;
