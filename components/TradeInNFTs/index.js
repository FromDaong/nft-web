import React from "react";
import { motion } from "framer-motion";
import Button from "react-bootstrap/Button";
import useRedeemV1forV2 from "../../hooks/useRedeemV1forV2";

const TradeInNFTS = ({ v1NFTs }) => {
  const ids = v1NFTs?.map((n) => n.id);
  const amounts = v1NFTs?.map((n) => n.balanceV1Number);

  console.log({ ids, amounts });

  const { onRedeemV1forV2 } = useRedeemV1forV2(ids, amounts);

  return (
    <motion.div
      animate={{ y: 0, opacity: 1 }}
      style={{ y: -100, opacity: 0 }}
      transition={{ delay: 0.25 }}
      className="pink-bg mb-5 text-center d-flex justify-content-center flex-column align-items-center"
      style={{ minHeight: "60vh" }}
    >
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

      <Button size="lg" onClick={() => onRedeemV1forV2()}>
        Trade in my Treat NFTs
      </Button>
    </motion.div>
  );
};

export default TradeInNFTS;
