import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import { modelSetBundles } from "../../treat/lib/constants";
import useGetTreatSetCost from "../../hooks/useGetTreatSetCost";
import useRedeemSet from "../../hooks/useRedeemSet";

const ModelListItem = ({ data, totwOnly = false }) => {
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

  const setId = modelSetBundles[data.username];
  const nftSetPrice = useGetTreatSetCost(setId);
  const { onRedeemSet } = setId
    ? useRedeemSet(setId, nftSetPrice)
    : { onRedeemSet: null };

  return (
    <>
      <a href={`/creator/${data.username}`}>
        <div className="model-list-item">
          <div className="creator">
            <div className="pic">
              <img src={data.profile_pic} className="profile-pic" />
            </div>
            <div className="details">
              <div className="label">CREATOR</div>
              <div className="name">{data.username}</div>
            </div>
          </div>
          <div className="button pt-4 pt-md-0 ">
            <Button variant="primary py-2 px-5 mr-3 w-sm-100">
              <b>VIEW CREATOR</b>
            </Button>
          </div>
        </div>
      </a>
      {!!onRedeemSet && totwOnly && (
        <div className="model-list-item">
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <span style={{ fontSize: "1.8em" }}>
              <b>Bundle Discount</b>
            </span>
            <img src={"/assets/treat-tag-25.png"} style={{ height: "6em" }} />
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Button onClick={onRedeemSet} size="lg">
              <b>BUY FULL SET</b>
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default ModelListItem;
