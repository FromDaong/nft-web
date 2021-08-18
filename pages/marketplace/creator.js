import { useWallet } from "use-wallet";
import Dropdown from "react-bootstrap/Dropdown";
import Button from "react-bootstrap/Button";
import useSWR from "swr";
import React, { useState, useEffect, useReducer } from "react";
import Loading from "../../components/Loading";
import Link from "next/link";
import Hero from "../../components/Hero";
import { Order } from "../../components/CreatorMarketplaceListItem";
import { motion, AnimateSharedLayout } from "framer-motion";

const Marketplace = ({ search }) => {
  const { data: orderBookArray } = useSWR(`/api/nft/get-marketplace-nfts`);
  const [cancelOrderData, setCancelOrderData] = useState(null);
  const [purchaseOrderData, setPurchaseOrderData] = useState(null);
  const [showPendingModal, setShowPendingModal] = useState(null);
  const [showCompleteModal, setShowCompleteModal] = useState(null);
  const [searchFilter, setSearchFilter] = useState(search || "");
  const [sortBy, setSortBy] = useState("Recent");
  const { account } = useWallet();

  return (
    <AnimateSharedLayout>
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
          title={"Creator Marketplace"}
          subtitle="The brand new official Treat creator marketplaces!"
          additionalContent={
            <Link href="/marketplace/resale">
              <Button variant="primary  w-sm-100">
                <b>{"Go to Resale Marketplace"}</b>
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
            {!orderBookArray ? (
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
