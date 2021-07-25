import { useWallet } from "use-wallet";
import Button from "react-bootstrap/Button";
import React from "react";
import useGetAllOpenOrders from "../hooks/useGetAllOpenOrders";
import useGetMaxIdForSale from "../hooks/useGetMaxIdForSale";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import { Order } from "../components/MarketplaceListItem";
import { motion, AnimatePresence } from "framer-motion";

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
      <div className="container fluid">
        <div className="row">
          <div className="nftForSale col-md-4">
            <Button>Buy Now</Button>
          </div>
          <div className="orderbook col-md-7">
            <h1>All Orders</h1>
            <div className="row">
              <Tabs defaultActiveKey="profile" id="uncontrolled-tab-example">
                <Tab eventKey="home" title="Details">
                  <p className="orderbook">
                    {" "}
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Doloremque repudiandae labore quisquam totam fugit,
                    accusantium nostrum sequi ut illo nobis?{" "}
                  </p>
                </Tab>
                <Tab eventKey="profile" title="Orders">
                  <div className="row">
                    <div className="orderbook nftResales col">
                      {orderBook.map((o) => (
                        <Order
                          order={o}
                          account={account}
                          key={`${o.nftId}_${o.seller}`}
                        />
                      ))}
                    </div>
                  </div>
                </Tab>
                <Tab eventKey="contact" title="History">
                  <p className="orderbook">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                    Autem, ipsum assumenda aliquid et quod libero accusantium
                    quia earum officiis consequuntur.
                  </p>
                </Tab>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </motion.main>
  );
};

export default Marketplace;
