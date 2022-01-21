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
import tags from "../../utils/tags";
import { Order } from "../../components/MarketplaceListItem";
import { motion, AnimateSharedLayout } from "framer-motion";
import { forceCheck } from "react-lazyload";
import Link from "next/link";
import { usePagination } from "react-use-pagination";
import BigNumber from "bignumber.js";
import Fuse from "fuse.js";
import Select from "react-select";
import ErrorFallback from "../../components/Fallback/Error";
import { useRouter } from "next/dist/client/router";

const Marketplace = ({ search }) => {
  const maxId = useGetMaxIdForSale();

  const [selectedOptions, setSelectedOptions] = useState([]);
  const [cancelOrderData, setCancelOrderData] = useState(null);
  const [storedArray, setStoredArray] = useState(null);
  const [purchaseOrderData, setPurchaseOrderData] = useState(null);
  const [showPendingModal, setShowPendingModal] = useState(null);
  const [showCompleteModal, setShowCompleteModal] = useState(null);
  const [orderBookArray, setOrderBookArray] = useState([]);
  const [searchFilter, setSearchFilter] = useState(search || "");
  const [persistedPageNumber, setPersistedPageNumber] = useState(0);
  const [sortBy, setSortBy] = useState("Recent");
  const [orderBook] = useGetAllOpenOrders(maxId);
  const { account } = useWallet();
  const [_, forceUpdate] = useReducer((x) => x + 1, 0);
  const router = useRouter();

  const initOrderBookArray = orderBook && orderBook.flat();

  const updateObArr = () => {
    const ob =
      initOrderBookArray && initOrderBookArray.length > 0
        ? initOrderBookArray
        : storedArray;

    if (ob) setOrderBookArray([]);
    if (ob) setOrderBookArray(ob);
    forceCheck();
  };

  useEffect(() => {
    (async () => {
      if (orderBookArray.length === 0) {
        const storedArrayGrab = await localStorage.getItem("orderBookArray");
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

  const { data: populatedNftData, error } = useSWR(
    orderBookArray && orderBookArray.length > 0 && jsonBody
      ? `/api/nft/get-many-nfts`
      : null,
    fetcher
  );

  const populatedArray =
    orderBookArray &&
    populatedNftData &&
    orderBookArray
      .map((orderBookNft) => {
        const nftResult = populatedNftData?.find(
          (x) => x.id === orderBookNft.nftId
        );
        if (!nftResult) return undefined;
        return { ...orderBookNft, ...nftResult };
      })
      .filter((e) => e);

  const fuse = new Fuse(populatedArray, {
    keys: ["name", "description", "model_handle", "tags"],
    shouldSort: false,
    useExtendedSearch: true,
    includeScore: true,
  });

  let selectedOptionsStr = "";
  selectedOptions.forEach((e) => (selectedOptionsStr += `="${e.value}" `));

  let filtered;

  if (searchFilter !== "" && selectedOptionsStr === "") {
    filtered = fuse.search({
      $or: [
        { name: searchFilter },
        { description: searchFilter },
        { model_handle: searchFilter },
      ],
    });
  } else if (searchFilter !== "" && selectedOptionsStr !== "") {
    filtered = fuse.search({
      $and: [{ tags: selectedOptionsStr }],
      $or: [{ name: searchFilter }],
    });
  } else if (searchFilter == "" && selectedOptionsStr !== "") {
    filtered = fuse.search({
      $and: [{ tags: selectedOptionsStr }],
    });
  } else if (populatedArray) {
    filtered = populatedArray.map((d, idx) => ({
      item: d,
      refIndex: idx,
    }));
  }

  const renderArray = filtered?.sort((a, b) => {
    switch (sortBy) {
      case "Relevancy":
        return Number(a.score) - Number(b.score);
      case "Price Low to High":
        return (
          Number(new BigNumber(a.item.price)) -
          Number(new BigNumber(b.item.price))
        );
      case "Price High to Low":
        return (
          Number(new BigNumber(b.item.price)) -
          Number(new BigNumber(a.item.price))
        );
      default:
        return (
          new Date(+b.item.listDate * 1000) - new Date(+a.item.listDate * 1000)
        );
    }
  });

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

  useEffect(() => {
    const queryFilter = router.query.s;
    const persistedPageNumber = router.query.p;
    const tags = router.query.tags;

    setSearchFilter(queryFilter ?? "");
    setPersistedPageNumber(
      persistedPageNumber ? Number(persistedPageNumber) : 0
    );

    if (tags) {
      let renamedTags = tags.replaceAll("=", ",");
      let tagsArray = renamedTags.split(",").reverse();
      tagsArray.pop();
      tagsArray = tagsArray.map((tag) => tag.replaceAll('"', ""));
      tagsArray.map((tag) =>
        setSelectedOptions((current) => [
          ...current,
          {
            label: tag,
            value: tag,
          },
        ])
      );
    }
  }, []);

  useEffect(() => {
    if (searchFilter || sortBy || currentPage) {
      router.push(
        `${router.pathname}?
        ${searchFilter && `s=${searchFilter}&`}
        ${currentPage && `p=${currentPage}&`}
        ${sortBy && `sort=${sortBy}&`}
        ${tags && `tags=${selectedOptionsStr}`}`,
        undefined,
        { shallow: true }
      );
    }
  }, [searchFilter, sortBy, currentPage]);

  useEffect(() => {
    if (renderArray.length !== 0 && persistedPageNumber) {
      setPage(persistedPageNumber);
      setPersistedPageNumber(null);
    }
  }, [renderArray]);

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
  }, [sortBy, storedArray, searchFilter]);

  return (
    <AnimateSharedLayout>
      <BlankModal
        show={!!showPendingModal}
        handleClose={() => setShowPendingModal(false)}
        title={"Waiting for Transaction Confirmation ⌛"}
        subtitle={
          "Please confirm this transaction in your wallet and wait here for up to a few minutes for the transaction to confirm..."
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
                Total: {renderArray ? renderArray.length : "Loading..."}
              </p>
              <Link href="/marketplace/creator">
                <a>
                  <Button variant="primary w-sm-100">
                    <b>{"Go to The Sweet Shop"}</b>
                  </Button>
                </a>
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

          <div className="d-flex">
            <Select
              options={tags}
              placeholder="Select Tags..."
              isMulti
              value={selectedOptions}
              onChange={(val) => setSelectedOptions(val)}
              styles={{
                control: () => ({
                  minWidth: 175,
                  height: "100%",
                  borderColor: "black",
                  background: "none",
                  display: "flex",
                  fontSize: "1.2em",
                }),
                indicatorSeparator: () => ({
                  display: "none",
                }),
                indicatorsContainer: () => ({
                  color: "black",
                  marginTop: 5,
                  display: "flex",
                }),
                placeholder: () => ({
                  color: "black",
                  position: "absolute",
                }),
              }}
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
                <Dropdown.Item
                  onClick={() => setSortBy("Relevancy")}
                  style={{
                    display: searchFilter === "" ? "none" : "block",
                  }}
                >
                  Relevancy
                </Dropdown.Item>
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
        </div>
        <br />
        <div className="">
          <div className="nft-list row mt-5 full-width justify-content-center">
            {!renderArray || renderArray.length === 0 ? (
              <div className="d-flex justify-content-center align-items-center w-100">
                <Loading custom="Loading data from the blockchain... Please ensure your wallet is connected." />
              </div>
            ) : error ? (
              <ErrorFallback custom="Error loading page" />
            ) : (
              <>
                {renderArray.slice(startIndex, endIndex).map((o, i) => (
                  <Order
                    searchFilter={searchFilter}
                    nftResult={o.item}
                    index={o.refIndex}
                    order={o.item}
                    account={account}
                    key={o.refIndex}
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
  return { search };
};

export default Marketplace;
