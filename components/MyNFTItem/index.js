import React, { useState, useEffect } from "react";
import Spinner from "react-bootstrap/Spinner";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { generateFromString } from "generate-avatar";
import { Blurhash } from "react-blurhash";

// import blur from "/assets/blur.png";

const NFTListItem = ({ data, revealNFTs }) => {
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

  return (
    <div className="my-nft-item row px-3 pt-3 pb-2">
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

      <div className="text-container container p-3 pt-5 pl-xl-0 pl-lg-3 px-lg-0 pt-lg-2 d-flex flex-direction-column align-items-center">
        <div
          className="img-container text-lg-left d-flex justify-content-center align-items-center w-100"
          onClick={() => {
            if (image) {
              setModalData(true);
            } else {
              revealNFTs();
            }
          }}
        >
          {data.image ? (
            image ? (
              <div
                style={{ background: `url(${image})` }}
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
          ) : (
            <Blurhash
              style={{ borderRadius: 5, overflow: "hidden" }}
              hash={data.blurhash}
              width={"100%"}
              height={300}
              resolutionX={32}
              resolutionY={32}
              punch={1}
            />
          )}
        </div>
        <div className="container">
          <div className="edition">
            YOU OWN {data.balance} OF {data.max_supply}
          </div>
          <div className="title">{data.name}</div>
          <div className="creator">
            <div className="details">
              {/* <div className="label">CREATOR</div> */}
              <div className="label">{data.attributes[0].value}</div>
            </div>
          </div>
          {/* <p>Coming soon...</p> */}
          <div className="row">
            <div className="col-lg-6 mt-3">
              <OverlayTrigger overlay={<Tooltip id="">Coming Soon!</Tooltip>}>
                <span className="d-inline-block w-100">
                  <Button
                    disabled
                    style={{ pointerEvents: "none" }}
                    className="w-100"
                  >
                    <b>STAKE</b>
                  </Button>
                </span>
              </OverlayTrigger>
            </div>
            <div className="col-lg-6 mt-3">
              <OverlayTrigger overlay={<Tooltip id="">Coming Soon!</Tooltip>}>
                <span className="d-inline-block w-100">
                  <Button
                    disabled
                    style={{ pointerEvents: "none" }}
                    className="w-100"
                    variant="secondary"
                  >
                    <b>RESELL</b>
                  </Button>
                </span>
              </OverlayTrigger>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NFTListItem;
