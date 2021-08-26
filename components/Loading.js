import React from "react";
import Spinner from "react-bootstrap/Spinner";

const Loading = ({ custom }) => {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        zIndex: 10000,
        top: 0,
        left: 0,
        justifyContent: "center",
        flexDirection: "column",
        alignItems: "center",
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
          "Loading... Please ensure your Binance Smart Chain wallet is connected."}
      </h5>
      <Spinner
        animation="border"
        role="status"
        size="xl"
        style={{ marginTop: 5 }}
      >
        <span className="sr-only">Loading...</span>
      </Spinner>
    </div>
  );
};

export default Loading;
