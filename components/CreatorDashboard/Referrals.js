import React from "react";
import { motion } from "framer-motion";
import CreatorNFTItem from "../CreatorNFTItem";
import { Button } from "react-bootstrap";
import { useWallet } from "use-wallet";
import { PiggyBankFill, Clipboard } from "react-bootstrap-icons";

const CreatedNFTs = ({
  transferNFTClick,
  listOrderClick,
  isLoading,
  nftData,
  modelData,
}) => {
  const { account } = useWallet();

  return (
    <div className="white-tp-bg" style={{ minHeight: 400 }}>
      <div
        className="px-4 py-2 w-100 d-flex"
        style={{
          background: "#FFFDF2",
          justifyContent: "space-between",
          alignItems: "center",
          borderRadius: 8,
        }}
      >
        <div>
          <h2
            className="heading-text-primary pt-1"
            style={{
              fontSize: 24,
            }}
          >
            <PiggyBankFill className="pb-1 mr-1" /> Referrals
          </h2>
        </div>

        <Button
          variant="primary  w-100"
          style={{ maxWidth: 250 }}
          onClick={() => {
            navigator.clipboard.writeText(
              `https://treatdao.com/become-creator?r=${account}`
            );
          }}
        >
          <b>
            <Clipboard className="pb-1 mr-2" size={24} />
            {"COPY REFERRAL LINK"}
          </b>
        </Button>
      </div>
      {modelData && modelData.referred && modelData.referred.length > 0 ? (
        <div className="container">
          <div className="d-flex text-left justify-content-center mt-3">
            <motion.div
              className="d-flex w-100 justify-content-center"
              animate="show"
              exit="hidden"
              initial="hidden"
            >
              {modelData.referred.map((referee) => {
                return (
                  referee && (
                    <div className="bg-primary text-white px-3 py-2 rounded">
                      {referee}
                    </div>
                  )
                );
              })}
            </motion.div>
          </div>
        </div>
      ) : (
        <div
          className="w-100 text-center font-weight-bold d-flex align-items-center justify-content-center h-100"
          style={{
            color: "#333",
            marginTop: -20,
            height: "100%",
            minHeight: 200,
          }}
        >
          You haven't had any completed referrals yet.
          <br />
          You receive a portion of sales fees of any NFTs they create.
        </div>
      )}
    </div>
  );
};

export default CreatedNFTs;
