import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import NFTListItem from "../NFTListItem";
import { Button } from "@chakra-ui/react";
import useSubscribe from "../../hooks/useSubscribe";
import BlankModal from "../../components/BlankModal";

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

const SubscriptionNFTs = ({
  modelData,
  onRedeemSet,
  modelNFTs,
  isSubscribed,
  subscriptionCost,
  formattedSubCost,
  account,
}) => {
  const [showPendingModal, setShowPendingModal] = useState(null);
  const [showCompleteModal, setShowCompleteModal] = useState(null);
  const [revealedNFTs, setRevealedNFTs] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { onSubscribe } = useSubscribe(modelData.address, 1, subscriptionCost);
  const renderNFTs = revealedNFTs || modelNFTs;

  const revealNFTs = async () => {
    if (account && treat) {
      const signature = await treat.signMessage(account, "Reveal Contents");

      const nftIds = modelNFTs.map((n) => n.id);

      setIsLoading(true);
      const res = await fetch(`/api/nft/view-sub-nfts`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nft_ids: nftIds, signature }),
      });
      const resJSON = await res.json();

      setIsLoading(false);
      if (resJSON.success) {
        setRevealedNFTs(resJSON.results);
      }
    }
  };

  const handleSubscribe = async () => {
    setShowPendingModal(true);
    onSubscribe()
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
      {!isSubscribed ? (
        <div className="not-subscribed-container">
          <div className="title">Subscribe to {modelData.username}</div>
          <div className="bio">
            Subscribe to mint exclusive NFTs from {modelData.username} that are
            available only to subscribers. You will immediately get access to{" "}
            <b>{modelData.sub_nfts.length} NFTs</b>, as well as any new NFTs{" "}
            {modelData.username} creates.
            {modelData.subscription && modelData.subscription.description && (
              <>
                <br />
                <br />
                {modelData.subscription.description}
              </>
            )}
          </div>
          <div className="amount mb-2">{formattedSubCost} BNB for 30 days</div>
          <Button onClick={handleSubscribe}>Subscribe to see NFTs</Button>
        </div>
      ) : !revealedNFTs ? (
        <div className="not-subscribed-container">
          <div className="title">
            You're Subscribed to {modelData.username}!
          </div>
          <div className="bio">
            To view {modelData.username}'s subscription NFTs, sign this message
            transaction so we can confirm your wallet with our backend.
            {/* {modelData.subscription.description} */}
          </div>
          <Button onClick={revealNFTs}>Reveal Subscription NFTs</Button>
        </div>
      ) : (
        <div
          className="row m-0 w-100 my-4"
          animate="show"
          exit="hidden"
          initial="hidden"
          variants={variants}
        >
          {modelNFTs.length === 0 && (
            <div className="text-center w-100 mt-5">Empty</div>
          )}
          {renderNFTs &&
            renderNFTs.length > 0 &&
            renderNFTs
              .sort((a, b) => a.list_price - b.list_price)
              .map((m) => (
                <div className="col-xs-12 col-md-6 col-xl-4 ">
                  <NFTListItem
                    isLoading={isLoading}
                    modelData={modelData}
                    data={m}
                    key={m.id}
                  />
                </div>
              ))}
        </div>
      )}
    </>
  );
};
export default SubscriptionNFTs;
