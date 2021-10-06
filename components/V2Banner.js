import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import swapV1ForV2 from "../hooks/swapV1ForV2";
import BlankModal from "../components/BlankModal";

const V2Banner = ({ oldTokenBalance }) => {
  const { onTradeInV1ForV2 } = swapV1ForV2(1);
  const [showPendingModal, setShowPendingModal] = useState(null);
  const [showCompleteModal, setShowCompleteModal] = useState(null);

  const swapTokens = () => {
    setShowPendingModal(true);
    onTradeInV1ForV2()
      .then((s) => {
        setShowPendingModal(false);
        if (s) {
          setShowCompleteModal(true);
        }
      })
      .catch((e) => console.log({ e }));
  };

  return (
    <>
      {/* START MODALS */}
      <BlankModal
        show={!!showPendingModal}
        handleClose={() => setShowPendingModal(false)}
        title={"Waiting for Transaction Confirmation ⌛"}
        subtitle={
          "Please confirm this transaction in your wallet and wait here for up to a few minutes for the transaction to confirm..."
        }
        noButton={true}
      />
      <BlankModal
        show={!!showCompleteModal}
        handleClose={() => setShowCompleteModal(false)}
      />
      {/* END MODALS */}

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
        <Button variant="light ml-3" onClick={swapTokens}>
          <b>{"Swap Tokens"}</b>
        </Button>
        <Button variant="outline ml-3">
          <b className="text-white" style={{ textDecoration: "underline" }}>
            {"More Info"}
          </b>
        </Button>
      </div>
    </>
  );
};

export default V2Banner;
