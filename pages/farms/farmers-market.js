import { useWallet } from "use-wallet";
import Dropdown from "react-bootstrap/Dropdown";
import Button from "react-bootstrap/Button";
import useSWR from "swr";
import React, { useState, useEffect, useReducer } from "react";
import Loading from "../../components/Loading";
import Link from "next/link";
import tags from "../../utils/tags";
import Hero from "../../components/Hero";
import { Order } from "../../components/CreatorMarketplaceListItem";
import { motion, AnimateSharedLayout } from "framer-motion";
import { forceCheck } from "react-lazyload";
import Select from "react-select";

const Marketplace = ({ search }) => {
  const [_, forceUpdate] = useReducer((x) => x + 1, 0);
  const { data: orderBookArray } = useSWR(`/api/nft/get-melon-nfts`);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [purchaseOrderData, setPurchaseOrderData] = useState(null);
  const [showPendingModal, setShowPendingModal] = useState(null);
  const [nftDataArray, setNftDataArray] = useState([]);
  const [searchFilter, setSearchFilter] = useState(search || "");
  const [sortBy, setSortBy] = useState("Recent");
  const { account } = useWallet();

  const updateObArr = () => {
    const ob = orderBookArray;

    if (ob) setNftDataArray([]);
    if (ob) setNftDataArray(ob);

    forceCheck();
  };

  const finalArray = nftDataArray;

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
        <center>
          <Hero
            title={"Farmers' 🍈  Market"}
            titleClass="text-success"
            subtitle="Redeem a random NFT from the pool of exclusive NFTs listed below for 10 $Melon."
            additionalContent={
              <div>
                <Link href="/farms">
                  <Button variant="primary w-sm-100 m-2">
                    <b>{"Farming Dashboard"}</b>
                  </Button>
                </Link>
                <Link href="/marketplace/resale">
                  <Button variant="success w-sm-100 m-2">
                    <b>{"Redeem Exclusive NFT"}</b>
                  </Button>
                </Link>
              </div>
            }
          />
        </center>
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
                <>
                  {finalArray
                    .slice(startIndex, endIndex || finalArray.length)
                    .map((o, i) => (
                      <Order
                        searchFilter={searchFilter}
                        nftResult={o.item}
                        index={i}
                        order={o.item}
                        account={account}
                        key={o.refIndex}
                        setPendingModal={setShowPendingModal}
                        openCompleteModal={() => setShowCompleteModal(true)}
                        setPurchaseOrderData={setPurchaseOrderData}
                      />
                    ))}
                </>
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
