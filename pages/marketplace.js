import { useWallet } from "use-wallet";
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

  // note, flatten the orderBook because useGetAllOpenOrders
  // returns a nested array
  return <MarketplaceList orderBook={orderBook.flat()} account={account} />;
};

const MarketplaceList = ({ orderBook, account }) => {
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
      <div className="container fluid">
        <div className="row">
          <div className="orderbook col-md-12">
            <div className="row">
              {orderBook.map((o) => (
                <Order
                  order={o}
                  account={account}
                  key={`${o.nftId}_${o.seller}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.main>
  );
};

export default Marketplace;
