import React, { useState, useEffect, createRef } from "react";
import { Blurhash } from "react-blurhash";
import { isBlurhashValid } from "blurhash";
import { EyeSlash } from "react-bootstrap-icons";
import Spinner from "react-bootstrap/Spinner";
import Button from "react-bootstrap/Button";
import Link from "next/link";
import { InView } from "react-intersection-observer";
import axios from "axios";

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
  soldOut,
}) => {
  const [image, setBase64Image] = useState();
  const [visible, setVisible] = useState(false);
  const [model, setModel] = useState({});

  const rr = createRef();

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

  useEffect(() => {
    if (visible) {
      console.log({ data }, 123);
      axios
        .get(`/api/model/find-by-id/${data.model_bnb_address}`)
        .then((res) => setModel(res.data))
        .catch((err) => console.error(err));
    }
  }, [visible]);

  const gotInView = (inView, entry) => {
    if (inView && !model.username) setVisible(true);
  };

  if (!data.attributes) return <div></div>;

  return (
    <Link href={`/view/${data.id}`}>
      <InView as={"a"} onChange={gotInView} className="row m-0 w-100 my-4">
        <div
          ref={rr}
          className={`nft-card ${
            (data.totw || data.totm || data.old_totw || data.old_totm) &&
            "purple"
          } ${soldOut ? "opacity-half" : ""}`}
          style={{ width: "100%" }}
        >
          <div className="totw-tag-wrapper">
            {isOwner ? (
              <div className="totw-tag">MY NFT</div>
            ) : (
              <>
                {(data.totw || data.old_totw) && (
                  <div className="totw-tag">TOTW</div>
                )}
                {(data.totm || data.old_totm) && (
                  <div className="totw-tag">TOTM</div>
                )}
              </>
            )}

            <div className="quantity-wrapper totw-tag">
              {false &&
                // TODO: Show this when graph is fixed
                Number(data.max_supply) - data.mints < 10 && (
                  <div className="quantity-wrapper totw-tag">
                    {Number(data.max_supply) - data.mints} of 10 left
                  </div>
                )}
            </div>
          </div>

          <Link href={`/creator/${model.username}`}>
            <a>
              <div
                className="profile-pic"
                style={{ backgroundImage: `url(${model.profile_pic})` }}
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
                {isBlurhashValid(data.blurhash).result ? (
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
                ) : (
                  <h3 className="text-center p4">
                    Please contact admin. Invalid Blurhash.
                  </h3>
                )}
              </>
            )}
          </div>
          <div className="text-container container">
            <div className="title-section">
              <div className="title">{data.name}</div>
              <div className="s">
                {owner && <b>Creator: </b>}
                {model.username}
              </div>
            </div>
            {(price || data.list_price) && (
              <div className="stats">
                <div className="stat">
                  <div className="number">{price || data.list_price}</div>
                  <div className="label">BNB</div>
                </div>
              </div>
            )}
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
      </InView>
    </Link>
  );
};

export default NFTListItem;
