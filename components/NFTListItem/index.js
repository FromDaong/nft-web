import React, { useEffect } from "react";

import { Blurhash } from "react-blurhash";
import { Button } from "@chakra-ui/react";
import { EyeSlash } from "react-bootstrap-icons";
import GumletImage from "../Image/GumletImage";
import { InView } from "react-intersection-observer";
import Link from "next/link";
import Spinner from "react-bootstrap/Spinner";
import { isBlurhashValid } from "blurhash";
import { useNFTItemData } from "../../lib/imagecdn";

const NFTListItem = ({
  data,
  buttonLabel,
  buttonFunction,
  isOwner,
  price,
  owner,
  soldOut,
}) => {
  useEffect(() => {
    // console.log("Data has changed ", data);
  }, [data]);

  const { ref, gotInView, model } = useNFTItemData(data);
  const isTOTMorOldTOTW =
    data.totw || data.totm || data.old_totw || data.old_totm;

  const profilePic = model
    ? `/api/v2/utils/images/fetchWithFallback?default=${model.profilePicCdnUrl}-/quality/lightest/-/format/webp/`
    : `/api/v2/utils/images/fetchWithFallback?default=${data.model_profile_pic}`;

  if (!data.attributes || !data.id) return <div></div>;

  return (
    <Link href={`/view/${data.id}`}>
      <InView
        as={"a"}
        onChange={gotInView}
        className="row m-0 w-100 my-4 justify-center"
      >
        <div
          ref={ref}
          className={`nft-card ${isTOTMorOldTOTW && "purple"} ${
            soldOut ? "opacity-half" : ""
          }`}
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
                // TODO: Show this when graph is moralis is integrated
                Number(data.max_supply) - data.mints < 10 && (
                  <div className="quantity-wrapper totw-tag">
                    {Number(data.max_supply) - data.mints} of 10 left
                  </div>
                )}
            </div>
          </div>

          <Link
            href={`/creator/${
              model ? model.username : data.attributes[0].value.slice(1, -1)
            }`}
          >
            <a>
              <div className="profile-pic">
                <img src={profilePic} />
              </div>
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
                  minHeight: 375,
                  zIndex: 100,
                }}
                className="dynamic-image"
              >
                <GumletImage
                  src={`/api/v2/utils/images/fetchWithFallback?default=${data.image}`}
                />
              </div>
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
                {model ? model.username : data.attributes[0].value.slice(1, -1)}
              </div>
            </div>
            {(typeof price !== "undefined" ||
              typeof data.list_price !== "undefined") && (
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

export default React.memo(NFTListItem);
