import React, { useState, useEffect } from "react";
import Spinner from "react-bootstrap/Spinner";
import Button from "react-bootstrap/Button";
import { generateFromString } from "generate-avatar";
import { Blurhash } from "react-blurhash";
import { EyeSlash } from "react-bootstrap-icons";

const ModelListItem = ({ data }) => {
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
    <a href={`/model/${data.username}`}>
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
            <b>VIEW MODEL</b>
          </Button>
        </div>
      </div>
    </a>
  );
};

export default ModelListItem;
