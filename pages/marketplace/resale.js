import { useWallet } from "use-wallet";
import Dropdown from "react-bootstrap/Dropdown";
import Button from "react-bootstrap/Button";
import React, { useState, useEffect, useReducer } from "react";
import useGetAllOpenOrders from "../../hooks/useGetAllOpenOrders";
import useGetMaxIdForSale from "../../hooks/useGetMaxIdForSale";
import Loading from "../../components/Loading";
import BlankModal from "../../components/BlankModal";
import CancelOrderModal from "../../components/CancelOrderModal";
import PurchaseOrderModal from "../../components/PurchaseOrderModal";
import Hero from "../../components/Hero";
import { Order } from "../../components/MarketplaceListItem";
import { motion, AnimateSharedLayout } from "framer-motion";
import { forceCheck } from "react-lazyload";
import Link from "next/link";

const Marketplace = ({ search }) => {
  const maxId = useGetMaxIdForSale();

  const [cancelOrderData, setCancelOrderData] = useState(null);
  const [storedArray, setStoredArray] = useState(null);
  const [purchaseOrderData, setPurchaseOrderData] = useState(null);
  const [showPendingModal, setShowPendingModal] = useState(null);
  const [showCompleteModal, setShowCompleteModal] = useState(null);
  const [orderBookArray, setOrderBookArray] = useState([]);
  const [searchFilter, setSearchFilter] = useState(search || "");
  const [sortBy, setSortBy] = useState("Recent");
  const [orderBook] = useGetAllOpenOrders(maxId);
  const { account } = useWallet();
  const [_, forceUpdate] = useReducer((x) => x + 1, 0);

  const initOrderBookArray = orderBook && orderBook.flat();

  const updateObArr = () => {
    const ob =
      initOrderBookArray && initOrderBookArray.length > 0
        ? initOrderBookArray
        : storedArray;

    if (ob) setOrderBookArray([]);

    const obArr = ob?.sort((a, b) => {
      switch (sortBy) {
        case "Price Low to High":
          return Number(a.price) - Number(b.price);
        case "Price High to Low":
          return Number(b.price) - Number(a.price);
        default:
          return a.listDate - b.listDate;
      }
    });

    if (obArr) setOrderBookArray(obArr);
    forceCheck();
  };

  useEffect(() => {
    (async () => {
      if (orderBookArray.length === 0) {
        const storedArrayGrab = await localStorage.getItem("orderBookArray");
        await setStoredArray(JSON.parse(storedArrayGrab));
      }
    })();
  }, []);

  useEffect(() => {
    if (
      initOrderBookArray &&
      orderBookArray.length !== initOrderBookArray.length
    ) {
      updateObArr();
      if (initOrderBookArray.length > 1) {
        console.log("updated local storage");
        localStorage.setItem(
          "orderBookArray",
          JSON.stringify(initOrderBookArray)
        );
      }
    }
  }, [initOrderBookArray]);

  useEffect(() => {
    updateObArr();
    forceUpdate();
  }, [sortBy, storedArray]);

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
          title={"Resale Marketplace"}
          subtitle="The brand new official Treat resale marketplaces!"
          additionalContent={
            <Link href="/marketplace/creator">
              <Button variant="primary w-sm-100">
                <b>{"Go to Creator Marketplace"}</b>
              </Button>
            </Link>
          }
        />
        <div className="full-width-search white-tp-bg p-3 d-flex">
          <input
            placeholder="Type to search for a model or NFT..."
            type="text"
            className="flex-grow-1 pl-2"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            style={{ fontSize: "1.1em" }}
          />
          <Dropdown>
            <Dropdown.Toggle
              variant="transparent"
              id="dropdown-basic"
              size="lg"
            >
              {sortBy}
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item onClick={() => setSortBy("Recent")}>
                Most Recent
              </Dropdown.Item>
              <Dropdown.Item onClick={() => setSortBy("Price Low to High")}>
                Price Low to High
              </Dropdown.Item>
              <Dropdown.Item onClick={() => setSortBy("Price High to Low")}>
                Price High to Low
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
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
            {!orderBookArray || orderBookArray.length === 0 ? (
              <div
                style={{ minHeight: 500 }}
                className="d-flex justify-content-center align-items-center w-100"
              >
                <Loading custom="Loading... This may take upto a few minutes, please ensure your wallet is connected." />
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

Marketplace.getInitialProps = async ({ query: { search } }) => {
  console.log({ search });
  return { search };
};

export default Marketplace;
