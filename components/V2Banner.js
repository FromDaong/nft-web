import React from "react";
import { Button } from "react-bootstrap";
const V2Banner = ({ custom }) => {
  return (
    <div
      className="alert-bar py-1 d-flex justify-content-center align-items-center"
      style={{
        color: "white",
        textAlign: "center",
        fontWeight: "bolder",
        background: "#D4668F",
        height: 60,
      }}
    >
      {
        "You have v1 $TREAT tokens which need to be swapped for v2 $TREAT tokens. "
      }
      <a
        href="https://docs.binance.org/smart-chain/developer/rpc.html"
        target="_blank"
        style={{ color: "white", textDecoration: "underline" }}
      >
        <Button variant="light ml-3">
          <b>{"Swap Tokens"}</b>
        </Button>
        <Button variant="outline ml-3">
          <b className="text-white" style={{ textDecoration: "underline" }}>
            {"More Info"}
          </b>
        </Button>
      </a>
    </div>
  );
};

export default V2Banner;
