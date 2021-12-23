import React from "react";
import Spinner from "react-bootstrap/Spinner";
import ModelListItem from "../ModelListItem";
import * as Scroll from "react-scroll";

/**
 *
 * TODO
 * Move pagination to its own component
 * Pass model data down to model list component.
 *
 */

const ModelList = ({ totwOnly = false, modelData, startIndex, endIndex }) => {

  let modelListRender;

  if (modelData) {
    const mR = modelData
      .slice(startIndex, endIndex || modelData.length)
      .map((raw) => {
        const model = raw.item;

        if (model.pending || model.rejected || model.hidden) return undefined;
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
            <div className="bg-transparent border-0 col-md-4">
              <ModelListItem key={model.username} data={model} />
            </div>
          );
        }
      })
      .filter((e) => e);

    modelListRender = (
      <div className="row">
        {mR}
      </div>
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
