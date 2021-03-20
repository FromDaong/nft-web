import React from "react";
import Spinner from "react-bootstrap/Spinner";

const Loading = () => {
  return (
    <div
      style={{
        position: "fixed",
        width: "100%",
        height: "100%",
        display: "flex",
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
        Please make sure your BNB wallet is connected.
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