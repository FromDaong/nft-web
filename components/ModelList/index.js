import React, { useState, useEffect } from "react";
import Spinner from "react-bootstrap/Spinner";
import ModelListItem from "../ModelListItem";
import useSWR from "swr";
import * as Scroll from "react-scroll";
import { motion } from "framer-motion";

const ModelList = ({ totwOnly = false }) => {
  const { data: modelResult } = useSWR(`/api/model`);
  const [modelData, setModelData] = useState();
  const [showToast, setShowToast] = useState(true);
  const toggleShowToast = () => setShowToast(!showToast);

  useEffect(() => {
    (async () => {
      if (modelResult) {
        setModelData(modelResult);
      }
    })();
  }, [modelResult]);

  let modelListRender;

  if (modelData) {
    const mR = modelData
      .map((model) => {
        if (model.pending || model.rejected) return undefined;
        if (totwOnly) {
          if (model && model.totw) {
            return (
              <div className="card">
                <ModelListItem
                  key={model.username}
                  data={model}
                  totwOnly={totwOnly}
                />
              </div>
            );
          } else return undefined;
        } else {
          return (
            <div className="card bg-transparent border-0">
              <ModelListItem key={model.username} data={model} />
            </div>
          );
        }
      })
      .filter((e) => e);

    modelListRender = (
      <motion.div
        className="card-columns"
        animate="show"
        exit="hidden"
        initial="hidden"
        variants={{
          show: {
            transition: { staggerChildren: 0.05 },
            opacity: 1,
          },
          hidden: {
            transition: {
              staggerChildren: 0.02,
              staggerDirection: -1,
              when: "afterChildren",
            },
          },
        }}
      >
        {mR}
      </motion.div>
    );
  } else {
    modelListRender = (
      <div className="w-100 d-flex justify-content-center align-items-center">
        <Spinner
          animation="border"
          role="status"
          size="xl"
          style={{ textAlign: "center" }}
        >
          <span className="sr-only">Loading...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <Scroll.Element name="model-list">
      <div className="nft-list">{modelListRender}</div>
    </Scroll.Element>
  );
};

export default ModelList;
