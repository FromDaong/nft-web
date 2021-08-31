import useSWR from "swr";
import { useWallet } from "use-wallet";
import Dropdown from "react-bootstrap/Dropdown";
import Pagination from "react-bootstrap/Pagination";
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
import { usePagination } from "react-use-pagination";
import BigNumber from "bignumber.js";

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
          return (
            Number(new BigNumber(a.price)) - Number(new BigNumber(b.price))
          );
        case "Price High to Low":
          return (
            Number(new BigNumber(b.price)) - Number(new BigNumber(a.price))
          );
        default:
          return new Date(+b.listDate * 1000) - new Date(+a.listDate * 1000);
      }
    });

    if (obArr) setOrderBookArray(obArr);
    forceCheck();
  };

  useEffect(() => {
    (async () => {
      if (orderBookArray.length === 0) {
        const storedArrayGrab = await localStorage.getItem("orderBookArray");
        console.log({ storedArrayGrab });
        // await setStoredArray(JSON.parse(storedArrayGrab));
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
        localStorage.setItem(
          "orderBookArray",
          JSON.stringify(initOrderBookArray)
        );
      }
    }
  }, [initOrderBookArray]);

  const jsonBody = { nfts: orderBookArray.map((o) => o.nftId) };

  const fetcher = (url) =>
    fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(jsonBody),
    }).then((a) => a.json());

  const { data: populatedNftData } = useSWR(
    orderBookArray && orderBookArray.length > 0 && jsonBody
      ? `/api/nft/get-many-nfts`
      : null,
    fetcher
  );

  const renderArray =
    orderBookArray &&
    populatedNftData &&
    orderBookArray
      .map((orderBookNft) => {
        const nftResult = populatedNftData.find(
          (x) => x.id === orderBookNft.nftId
        );

        if (!nftResult) return undefined;

        if (
          !nftResult.attributes[0].value
            .toLowerCase()
            .includes(searchFilter.toLowerCase()) &&
          !nftResult.name.toLowerCase().includes(searchFilter.toLowerCase())
        ) {
          return undefined;
        } else return { ...orderBookNft, ...nftResult };
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
    totalItems: renderArray ? renderArray.length : 0,
    initialPageSize: 10,
  });

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

  useEffect(() => {
    updateObArr();
    forceUpdate();
    setPage(0);
  }, [sortBy, storedArray, searchFilter]);

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
          subtitle={`The brand new official Treat resale marketplaces!`}
          additionalContent={
            <>
              <p
                className="totw-secondary-text"
                style={{ maxWidth: "none", marginTop: -12, fontSize: "0.95em" }}
              >
                Number of active resale listings:{" "}
                {renderArray ? renderArray.length : "Loading..."}
              </p>
              <Link href="/marketplace/creator">
                <Button variant="primary w-sm-100">
                  <b>{"Go to The Sweet Shop"}</b>
                </Button>
              </Link>
            </>
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
          <div className="nft-list row mt-5">
            {!renderArray || renderArray.length === 0 ? (
              <div
                style={{ minHeight: 500 }}
                className="d-flex justify-content-center align-items-center w-100"
              >
                <Loading custom="Loading data from the blockchain... Please ensure your wallet is connected." />
              </div>
            ) : (
              <>
                {renderArray.slice(startIndex, endIndex).map((o, i) => (
                  <Order
                    searchFilter={searchFilter}
                    nftResult={o}
                    index={i}
                    order={o}
                    account={account}
                    key={`${o.nftId}_${o.seller}_${o.price}_${i}`}
                    setPendingModal={setShowPendingModal}
                    openCompleteModal={() => setShowCompleteModal(true)}
                    setCancelOrderData={setCancelOrderData}
                    setPurchaseOrderData={setPurchaseOrderData}
                  />
                ))}
              </>
            )}
          </div>

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
