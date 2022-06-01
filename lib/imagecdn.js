import { createRef, useEffect, useState } from "react";

import axios from "axios";

export const getImageFromCdn = (image) => {};

export const useGetImageFromCdn = (data) => {
  const [image, setImage] = useState();

  useEffect(() => {
    if (!data.image) return;
    axios
      .get(
        `/api/v2/utils/images/fetchWithFallback?default=${data.image}&cdn=${data.daoCdnUrl}`
      )
      .then((res) => {
        if (res.data === data.image) {
          axios
            .get(data.image)
            .then((res) =>
              setImage(res.data.replace(`"`, "").replace(/["']/g, ""))
            )
            .catch((err) => console.log(err));
        } else {
          setImage(res.data);
        }
      });
  }, [data]);
};

export const useNFTItemData = (data) => {
  const [visible, setVisible] = useState(false);
  const [model, setModel] = useState(null);
  const ref = createRef();

  useEffect(() => {
    if (visible && !model) {
      axios
        .get(`/api/model/get-profile/${data.model_bnb_address}`)
        .then((res) => {
          setModel({
            ...res.data,
            profilePicCdnUrl: res.data.profilePicCdnUrl ?? res.data.profile_pic,
          });
        })
        .catch((err) => console.error(err));
    }
  }, [visible, model]);

  const gotInView = (inView) => {
    if (inView && !model) setVisible(true);
  };

  return { ref, gotInView, model };
};
