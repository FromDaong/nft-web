import React from "react";
import Spinner from "react-bootstrap/Spinner";

const TagsSelector = ({ custom }) => {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        zIndex: 10000,
        justifyContent: "center",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: 50,
        paddingBottom: 50,
      }}
    >
      <h5
        style={{
          fontWeight: "bolder",
          background: "white",
          borderRadius: 5,
          padding: 10,
        }}
      >
        {custom ||
          "TagsSelector... Please ensure your Binance Smart Chain wallet is connected."}
      </h5>
      <Spinner
        animation="border"
        role="status"
        size="xl"
        style={{ marginTop: 5 }}
      >
        <span className="sr-only">TagsSelector...</span>
      </Spinner>
    </div>
  );
};

export default TagsSelector;
