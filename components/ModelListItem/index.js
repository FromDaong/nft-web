import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";

let easing = [0.175, 0.85, 0.42, 0.96];

const ModelListItem = ({ data, totwOnly = false, disableAnim }) => {
  return (
    <a href={`/creator/${data.username.replace("@", "")}`}>
      <div className="model-list-item">
        <div className="creator">
          <div
            className="pic"
            style={{
              backgroundImage: `url('${data.profilePicCdnUrl}-/quality/lighter/-/format/webp/')`,
            }}
          ></div>
          <div className="details">
            <div className="label">CREATOR</div>
            <div className="name">{data.username}</div>
          </div>
        </div>
        <div className="button pt-4 pt-md-0 ">
          <Button variant="primary w-100">
            <b>VIEW CREATOR</b>
          </Button>
        </div>
      </div>
    </a>
  );
};

export default ModelListItem;
