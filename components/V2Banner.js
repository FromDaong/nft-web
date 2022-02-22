import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import hasApprovedV1ForV2 from "../hooks/hasApprovedV1ForV2";
import approveV1ForV2 from "../hooks/approveV1ForV2";
import swapV1ForV2 from "../hooks/swapV1ForV2";
import BlankModal from "../components/BlankModal";
import Web3 from "web3";

const V2Banner = ({ oldTokenBalance }) => {
  const { onTradeInV1ForV2 } = swapV1ForV2(oldTokenBalance.toString());
  const { onApprove } = approveV1ForV2();
  const [showPendingModal, setShowPendingModal] = useState(null);
  const [showCompleteModal, setShowCompleteModal] = useState(null);
  const hasApproved = hasApprovedV1ForV2();


  const approveContract = () => {
    setShowPendingModal(true);
    onApprove()
      .then((s) => {
        setShowPendingModal(false);
        if (s) {
          setShowCompleteModal(true);
        }
      })
      .catch((e) => console.error({ e }));
  };

  const swapTokens = () => {
    setShowPendingModal(true);
    onTradeInV1ForV2()
      .then((s) => {
        setShowPendingModal(false);
        if (s) {
          setShowCompleteModal(true);
        }
      })
      .catch((e) => console.error({ e }));
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
        {+hasApproved ? (
          <Button variant="light ml-3" onClick={swapTokens}>
            <b>{"Swap Tokens"}</b>
          </Button>
        ) : (
          <Button variant="light ml-3" onClick={approveContract}>
            <b>{"Approve V2 Contract"}</b>
          </Button>
        )}
        <a
          href="https://docs.google.com/gview?url=https://github.com/TreatDAO/litepaper/raw/main/TreatPaperFinal.pdf&embedded=true"
          target="_blank" rel="noreferrer"
        >
          <Button variant="outline ml-3">
            <b className="text-white" style={{ textDecoration: "underline" }}>
              {"More Info"}
            </b>
          </Button>
        </a>
      </div>
    </>
  );
};

export default V2Banner;
