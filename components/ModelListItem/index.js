import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import { modelSetBundles } from "../../treat/lib/constants";
import useGetTreatSetCost from "../../hooks/useGetTreatSetCost";
import useRedeemSet from "../../hooks/useRedeemSet";
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

const ModelListItem = ({ data, totwOnly = false, disableAnim }) => {
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

  return (
    <motion.div variants={variants} initial={disableAnim}>
      <a href={`/creator/${data.username.replace("@", "")}`}>
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
    </motion.div>
  );
};

export default ModelListItem;
