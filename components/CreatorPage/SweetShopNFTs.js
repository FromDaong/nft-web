import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import NFTListItem from "../NFTListItem";
import { Button } from "react-bootstrap";

const variants = {
  show: {
    transition: { staggerChildren: 0.25 },
    when: "afterChildren",
    opacity: 1,
  },
  hidden: {
    transition: {
      staggerChildren: 0.02,
      staggerDirection: -1,
      when: "afterChildren",
    },
  },
};

const SweetShopNFTs = ({ modelData, onRedeemSet, modelNFTs }) => {
  return (
    <>
      {!!onRedeemSet && (
        <div
          style={{
            backgroundColor: "rgba(255,255,255,0.75)",
            marginBottom: "25px",
            display: "flex",
            justifyContent: "center",
            paddingTop: "2%",
            paddingBottom: "2%",
            borderRadius: "8px",
          }}
        >
          <Button onClick={onRedeemSet} size="lg">
            Redeem full set for {getDisplayBalance(nftSetPrice)} BNB
          </Button>
        </div>
      )}

      <motion.div
        className="row m-0 w-100 my-4"
        animate="show"
        exit="hidden"
        initial="hidden"
        variants={variants}
      >
        {modelNFTs &&
          modelNFTs.length > 0 &&
          modelNFTs
            .sort((a, b) => a.list_price - b.list_price)
            .map((m) => (
              <div className="col-xs-12 col-md-6 col-xl-4 ">
                <NFTListItem modelData={modelData} data={m} key={m.id} />
              </div>
            ))}
      </motion.div>
    </>
  );
};
export default SweetShopNFTs;