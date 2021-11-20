import { useWallet } from "use-wallet";
import Button from "react-bootstrap/Button";
import useSWR from "swr";
import React, { useState, useEffect, useReducer } from "react";
import Loading from "../../components/Loading";
import NFTListItem from "../../components/NFTListItem";
import BlankModal from "../../components/BlankModal";
import Link from "next/link";
import useBuyMelonNft from "../../hooks/useBuyMelonNft";
import Hero from "../../components/Hero";
import useTokenBalance from "../../hooks/useTokenBalance";
import { contractAddresses } from "../../treat/lib/constants.js";
import { getDisplayBalance } from "../../utils/formatBalance";
import { motion, AnimateSharedLayout } from "framer-motion";
import { forceCheck } from "react-lazyload";

const Marketplace = ({ search }) => {
  const { chainId } = useWallet();
  const treatBal = useTokenBalance(contractAddresses.treat2[chainId]);
  const melonBal = getDisplayBalance(
    useTokenBalance(contractAddresses.melon[chainId])
  );
  const { data: orderBookArray } = useSWR(`/api/nft/get-melon-nfts`);
  const [showPendingModal, setShowPendingModal] = useState(null);
  const [showCompleteModal, setShowCompleteModal] = useState(null);
  const [nftDataArray, setNftDataArray] = useState([]);
  const { onBuyMelonNft } = useBuyMelonNft();
  const { account } = useWallet();

  const actionWithModal = (action, param) => {
    setShowPendingModal(true);
    action(param)
      .then(() => {
        setShowPendingModal(false);
        setShowCompleteModal(true);
      })
      .catch((e) => console.log({ e }));
  };

  const finalArray = orderBookArray;

  console.log({ finalArray });

  return (
    <AnimateSharedLayout>
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

      <motion.main
        variants={{
          hidden: { opacity: 0, x: -200, y: 0 },
          enter: { opacity: 1, x: 0, y: 0 },
          exit: { opacity: 0, x: 0, y: -100 },
        }}
        initial="hidden" // Set the initial state to variants.hidden
        animate="enter" // Animated state to variants.enter
        exit="exit" // Exit state (used later) to variants.exit
        transition={{ type: "linear" }} // Set the transition to linear
        className=""
      >
        <center>
          <Hero
            title={"Farmers' 🍈  Market"}
            titleClass="text-success"
            subtitle="Redeem a random NFT from the pool of exclusive NFTs listed below for 10 $Melon."
            additionalContent={
              <div>
                <Link href="/farms">
                  <Button variant="primary w-sm-100 m-2">
                    <b>{"Go to Farming Dashboard"}</b>
                  </Button>
                </Link>
              </div>
            }
          />
        </center>
        <div className="melon-balance mb-0 pb-0 pink-bg">
          <div>
            <b>🍈 $Melon Balance:</b> {melonBal}
          </div>
          <Button
            variant="success w-sm-100"
            onClick={() => actionWithModal(onBuyMelonNft)}
          >
            <b>{"Redeem Exclusive NFT"}</b>
          </Button>
        </div>
        <div className="container fluid">
          <motion.div
            layout
            className="nft-list row mt-5 full-width justify-content-center"
            animate="show"
            exit="hidden"
            initial="hidden"
            variants={{
              show: { opacity: 1 },
              hidden: {
                transition: {
                  staggerChildren: 0.02,
                  staggerDirection: -1,
                  when: "afterChildren",
                  opacity: 0,
                },
              },
            }}
          >
            {!finalArray ? (
              <div
                style={{ minHeight: 500 }}
                className="d-flex justify-content-center align-items-center w-100"
              >
                <Loading custom="Loading... This may take up to a few minutes, please ensure your wallet is connected." />
              </div>
            ) : (
              finalArray.length > 0 && (
                <div className="d-flex justify-content-center flex-wrap w-100">
                  {finalArray.map((o, i) => (
                    <div
                      classname="d-flex justify-content-center"
                      style={{ width: 370 }}
                    >
                      <NFTListItem data={o} disableAnimations />
                    </div>
                  ))}
                </div>
              )
            )}
          </motion.div>
        </div>
      </motion.main>
    </AnimateSharedLayout>
  );
};

Marketplace.getInitialProps = async ({ query: { search } }) => {
  return { search };
};

export default Marketplace;
