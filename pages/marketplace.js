import { useWallet } from "use-wallet";
import Spinner from "react-bootstrap/Spinner";
import Button from "react-bootstrap/Button";
import React from "react";
import useGetAllOpenOrders from "../hooks/useGetAllOpenOrders";
import useGetMaxIdForSale from "../hooks/useGetMaxIdForSale";
import Hero from "../components/Hero";
import { Order } from "../components/MarketplaceListItem";
import { motion } from "framer-motion";

const Marketplace = () => {
  const maxId = useGetMaxIdForSale();

  const [orderBook] = useGetAllOpenOrders(maxId);
  const { account } = useWallet();

  const orderBookArray = orderBook && orderBook.flat();
  console.log({ orderBookArray });

  return (
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
        <input type="text" className="flex-grow-1 pl-2" />
        <Button size="lg" variant="primary">
          Search
        </Button>
      </div>
      <br />
      <div className="container fluid">
        <motion.div
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
              <Spinner
                animation="border"
                role="status"
                size="xl"
                variant="primary"
              >
                <span className="sr-only">Loading...</span>
              </Spinner>
            </div>
          ) : (
            <>
              {orderBookArray.map((o) => (
                <div className="col-md-4">
                  <Order
                    order={o}
                    account={account}
                    key={`${o.nftId}_${o.seller}`}
                  />
                </div>
              ))}
            </>
          )}
        </motion.div>
      </div>
    </motion.main>
  );
};

export default Marketplace;
