import { useWallet } from "use-wallet";
import Spinner from "react-bootstrap/Spinner";
import Button from "react-bootstrap/Button";
import React, { useState } from "react";
import useGetAllOpenOrders from "../hooks/useGetAllOpenOrders";
import useGetMaxIdForSale from "../hooks/useGetMaxIdForSale";
import Loading from "../components/Loading";
import BlankModal from "../components/BlankModal";
import CancelOrderModal from "../components/CancelOrderModal";
import PurchaseOrderModal from "../components/PurchaseOrderModal";
import Hero from "../components/Hero";
import { Order } from "../components/MarketplaceListItem";
import { motion, AnimateSharedLayout } from "framer-motion";

const Marketplace = () => {
  const maxId = useGetMaxIdForSale();

  const [cancelOrderData, setCancelOrderData] = useState(null);
  const [purchaseOrderData, setPurchaseOrderData] = useState(null);
  const [showPendingModal, setShowPendingModal] = useState(null);
  const [showCompleteModal, setShowCompleteModal] = useState(null);
  const [searchFilter, setSearchFilter] = useState("");
  const [orderBook] = useGetAllOpenOrders(maxId);
  const { account } = useWallet();

  const orderBookArray = orderBook && orderBook.flat();

  return (
    <AnimateSharedLayout>
      <BlankModal
        show={!!showPendingModal}
        handleClose={() => setShowPendingModal(false)}
        title={"Waiting for Transaction Confirmation ⌛"}
        subtitle={
          "Please confirm this transaction in your wallet and wait here for upto a few minutes for the transaction to confirm..."
        }
        noButton={true}
        account={account}
      />
      <BlankModal
        show={!!showCompleteModal}
        handleClose={() => setShowCompleteModal(false)}
        account={account}
      />
      <CancelOrderModal
        show={!!cancelOrderData}
        data={cancelOrderData}
        setPendingModal={setShowPendingModal}
        openCompleteModal={() => setShowCompleteModal(true)}
        handleClose={() => setCancelOrderData(null)}
        account={account}
      />
      <PurchaseOrderModal
        show={!!purchaseOrderData}
        data={purchaseOrderData?.nftData}
        order={purchaseOrderData?.order}
        setPendingModal={setShowPendingModal}
        openCompleteModal={() => setShowCompleteModal(true)}
        handleClose={() => setPurchaseOrderData(null)}
        account={account}
      />
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
        <Hero
          title={"Marketplace"}
          subtitle="The brand new official Treat resale marketplace!"
        />
        <div className="full-width-search white-tp-bg p-3 d-flex">
          <input
            placeholder="Search for model or a specific NFT..."
            type="text"
            className="flex-grow-1 pl-2"
            onChange={(e) => setSearchFilter(e.target.value)}
            style={{ fontSize: "1.1em" }}
          />
          <Button size="lg" variant="primary">
            Search
          </Button>
        </div>
        <br />
        <div className="container fluid">
          <motion.div
            layout
            className="nft-list row mt-5"
            animate="show"
            exit="hidden"
            initial="hidden"
            variants={{
              show: { transition: { staggerChildren: 0.15 }, opacity: 1 },
              hidden: {
                transition: {
                  staggerChildren: 0.02,
                  staggerDirection: -1,
                  when: "afterChildren",
                },
              },
            }}
          >
            {!orderBookArray || orderBookArray.length === 0 ? (
              <div
                style={{ minHeight: 500 }}
                className="d-flex justify-content-center align-items-center w-100"
              >
                <Loading />
              </div>
            ) : (
              <>
                {orderBookArray.map((o, i) => (
                  <Order
                    searchFilter={searchFilter}
                    index={i}
                    order={o}
                    account={account}
                    key={`${o.nftId}_${o.seller}`}
                    setPendingModal={setShowPendingModal}
                    openCompleteModal={() => setShowCompleteModal(true)}
                    setCancelOrderData={setCancelOrderData}
                    setPurchaseOrderData={setPurchaseOrderData}
                  />
                ))}
              </>
            )}
          </motion.div>
        </div>
      </motion.main>
    </AnimateSharedLayout>
  );
};

export default Marketplace;
