import { Blurhash } from "react-blurhash";
import { Button } from "react-bootstrap";
import { EyeSlash } from "react-bootstrap-icons";
import InView from "react-intersection-observer";
import Link from "next/link";
import Modal from "react-bootstrap/Modal";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Spinner from "react-bootstrap/Spinner";
import Tooltip from "react-bootstrap/Tooltip";
import { isBlurhashValid } from "blurhash";
import { useNFTItemData } from "../../lib/imagecdn";
import { useState } from "react";

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
  const [modalData, setModalData] = useState();
  const [loadHighRes] = useState(false);
  const { ref, gotInView, model } = useNFTItemData(data);

  const bgImage = loadHighRes
    ? data.daoCdnUrl
      ? `url('${data.daoCdnUrl}-/quality/lightest/-/format/webp/')`
      : `url('${data.image}')`
    : `url('/api/v2/utils/images/fetchWithFallback?default=${data.image}')`;

  const profilePic = model
    ? `url('/api/v2/utils/fetchWithFallback?default=${model.profilePicCdnUrl}-/quality/lightest/-/format/webp/')`
    : `url('/api/v2/utils/fetchWithFallback?default=${data.model_profile_pic}')`;

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
            style={{
              background: `url(${bgImage})`,
            }}
          ></div>
          <h4 className="text-center pt-3">{data.description}</h4>
        </Modal.Body>
        <Modal.Footer>
          <div className="container text-center">
            <Button onClick={() => setModalData(null)}>Close</Button>
          </div>
        </Modal.Footer>
      </Modal>

      <InView as={"a"} onChange={gotInView} className="row m-0 w-100 my-4">
        <div ref={ref} className="nft-card" style={{ boxShadow: "none" }}>
          <div className="totw-tag-wrapper">
            {balance > 1 && (
              <div className="quantity-wrapper totw-tag">
                {balance}x Available
              </div>
            )}
          </div>
          <Link href={`/creator/${data.attributes[0].value.replace("@", "")}`}>
            <a>
              <div
                className="profile-pic"
                style={{ backgroundImage: profilePic }}
              />
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
            onClick={() => {
              if (bgImage) {
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
                    backgroundImage: `url('/api/v2/utils/images/fetchWithFallback?default=${data.image}')`,
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

          {transferNFTClick ? (
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
      </InView>
    </>
  );
};

export default NFTListItem;
