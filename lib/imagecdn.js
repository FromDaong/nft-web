import axios from "axios";
import { createRef, useEffect, useState } from "react";

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
          console.log("Setting res");
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
        .get(`/api/model/find-by-id/${data.model_bnb_address}`)
        .then((res) => setModel(res.data))
        .catch((err) => console.error(err));
    }
  }, [visible, model]);

  const gotInView = (inView) => {
    if (inView && !model) setVisible(true);
  };

  useEffect(() => {
    if (visible) {
      axios
        .get(`/api/model/find-by-id/${data.model_bnb_address}`)
        .then((res) => setModel(res.data))
        .catch((err) => console.error(err));
    }
  }, [visible]);

  return { ref, gotInView, model };
};
