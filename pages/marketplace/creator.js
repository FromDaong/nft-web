import { useWallet } from "use-wallet";
import Dropdown from "react-bootstrap/Dropdown";
import Button from "react-bootstrap/Button";
import Pagination from "react-bootstrap/Pagination";
import useSWR from "swr";
import React, { useState, useEffect, useReducer } from "react";
import Loading from "../../components/Loading";
import Link from "next/link";
import Hero from "../../components/Hero";
import { Order } from "../../components/CreatorMarketplaceListItem";
import { motion, AnimateSharedLayout } from "framer-motion";
import { forceCheck } from "react-lazyload";
import { usePagination } from "react-use-pagination";

const Marketplace = ({ search }) => {
  const [_, forceUpdate] = useReducer((x) => x + 1, 0);
  const { data: orderBookArray } = useSWR(`/api/nft/get-marketplace-nfts`);
  const [cancelOrderData, setCancelOrderData] = useState(null);
  const [purchaseOrderData, setPurchaseOrderData] = useState(null);
  const [showPendingModal, setShowPendingModal] = useState(null);
  const [nftDataArray, setNftDataArray] = useState([]);
  const [searchFilter, setSearchFilter] = useState(search || "");
  const [sortBy, setSortBy] = useState("Recent");
  const { account } = useWallet();

  const updateObArr = () => {
    const ob = orderBookArray;

    if (ob) setNftDataArray([]);

    const obArr = ob?.sort((a, b) => {
      switch (sortBy) {
        case "Price Low to High":
          return Number(a.list_price) - Number(b.list_price);
        case "Price High to Low":
          return Number(b.list_price) - Number(a.list_price);
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

    if (obArr) setNftDataArray(obArr);
    forceCheck();
  };

  const finalArray = nftDataArray
    .map((orderBookNft) => {
      console.log({ orderBookNft });
      if (
        !orderBookNft.attributes[0].value
          .toLowerCase()
          .includes(searchFilter.toLowerCase()) &&
        !orderBookNft.name.toLowerCase().includes(searchFilter.toLowerCase())
      ) {
        return undefined;
      } else return orderBookNft;
    })
    .filter((e) => e);

  const {
    currentPage,
    totalPages,
    setPage,
    setPageSize,
    setNextPage,
    setPreviousPage,
    startIndex,
    endIndex,
  } = usePagination({
    totalItems: finalArray ? finalArray.length : 0,
    initialPageSize: 25,
  });

  useEffect(() => {
    updateObArr();
    forceUpdate();
    setPage(0);
  }, [orderBookArray, sortBy, showPendingModal]);

  const startNumber = currentPage - 5 > 0 ? currentPage - 5 : 0;
  const endNumber = currentPage + 5 < totalPages ? currentPage + 5 : totalPages;

  let items = [];
  if (currentPage !== 0)
    items.push(<Pagination.First onClick={() => setPage(0)} />);
  if (currentPage !== 0)
    items.push(<Pagination.Prev onClick={setPreviousPage} />);

  for (let number = startNumber; number < endNumber; number++) {
    items.push(
      <Pagination.Item
        key={number}
        active={number === currentPage}
        onClick={() => {
          setPageSize(25);
          setPage(number);
        }}
      >
        {number + 1}
      </Pagination.Item>
    );
  }
  if (currentPage !== totalPages - 1)
    items.push(<Pagination.Next onClick={setNextPage} />);
  if (currentPage !== totalPages - 1)
    items.push(<Pagination.Last onClick={() => setPage(totalPages)} />);

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
          title={"The Sweet Shop"}
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
            {!finalArray ? (
              <div
                style={{ minHeight: 500 }}
                className="d-flex justify-content-center align-items-center w-100"
              >
                <Loading custom="Loading... This may take up to a few minutes, please ensure your wallet is connected." />
              </div>
            ) : (
              <>
                {finalArray.slice(startIndex, endIndex).map((o, i) => (
                  <Order
                    searchFilter={searchFilter}
                    nftResult={o}
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

          <div className="d-flex justify-content-center">
            <Pagination>{items}</Pagination>
          </div>
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
