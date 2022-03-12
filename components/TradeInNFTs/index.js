import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@chakra-ui/react";
import useRedeemV1forV2 from "../../hooks/useRedeemV1forV2";
import BlankModal from "../../components/BlankModal";

const TradeInNFTs = ({ v1NFTs, account }) => {
  const [showPendingModal, setShowPendingModal] = useState(null);
  const [showCompleteModal, setShowCompleteModal] = useState(null);
  const ids = v1NFTs?.map((n) => n.id);
  const amounts = v1NFTs?.map((n) => n.balanceV1Number);

  const { onRedeemV1forV2 } = useRedeemV1forV2(ids, amounts);

  const tradeInClick = () => {
    setShowPendingModal(true);
    onRedeemV1forV2().then((s) => {
      setShowPendingModal(false);
      if (s) {
        setShowCompleteModal(true);
      }
    });
  };

  return (
    <div
      animate={{ y: 0, opacity: 1 }}
      style={{ y: -100, opacity: 0 }}
      transition={{ delay: 0.25 }}
      className="pink-bg mb-5 text-center d-flex justify-content-center flex-column align-items-center"
      style={{ minHeight: "70vh" }}
    >
      <BlankModal
        show={!!showPendingModal}
        handleClose={() => setShowPendingModal(false)}
        title={"Waiting for Transaction Confirmation ⌛"}
        subtitle={
          "Please confirm this transaction in your wallet and wait here for up to a few minutes for the transaction to confirm..."
        }
        noButton={true}
        account={account}
      />
      <BlankModal
        show={!!showCompleteModal}
        handleClose={() => setShowCompleteModal(false)}
        account={account}
      />

      <div className="heading-text p-0 mt-5" style={{ fontSize: "3.5em" }}>
        Trade in your v1 for v2 Treat NFTs
      </div>
      <p
        className="totw-secondary-text m-0 mt-1 pb-3"
        style={{ margin: "auto", maxWidth: 700 }}
      >
        In order to continue using Treat DAO, and all of our great new features
        including a brand new resale marketplace, you must trade in your v1
        Treat NFTs for v2 NFTs. This can be done with a simple confirmation in
        your wallet.
      </p>

      <Button size="lg" onClick={tradeInClick}>
        Trade in my Treat NFTs
      </Button>
    </div>
  );
};

export default TradeInNFTs;
