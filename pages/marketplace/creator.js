import { useWallet } from "use-wallet";
import Dropdown from "react-bootstrap/Dropdown";
import Button from "react-bootstrap/Button";
import Pagination from "react-bootstrap/Pagination";
import useSWR from "swr";
import React, { useState, useEffect, useReducer } from "react";
import Loading from "../../components/Loading";
import Link from "next/link";
import tags from "../../utils/tags";
import Hero from "../../components/Hero";
import { Order } from "../../components/CreatorMarketplaceListItem";
import { motion, AnimateSharedLayout } from "framer-motion";
import { forceCheck } from "react-lazyload";
import { usePagination } from "react-use-pagination";
import Fuse from "fuse.js";
import Select from "react-select";
import { useRouter } from "next/dist/client/router";
import ErrorFallback from "../../components/Fallback/Error";

// TODO: Fetch NFTs from blockchain
// database seems to be outdated

const Marketplace = ({ search }) => {
  const [_, forceUpdate] = useReducer((x) => x + 1, 0);
  const { data: orderBookArray, error } = useSWR(
    `/api/nft/get-marketplace-nfts`
  );
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [purchaseOrderData, setPurchaseOrderData] = useState(null);
  const [showPendingModal, setShowPendingModal] = useState(null);
  const [nftDataArray, setNftDataArray] = useState([]);
  const [searchFilter, setSearchFilter] = useState(search || "");
  const [sortBy, setSortBy] = useState("Recent");
  const [persistedPageNumber, setPersistedPageNumber] = useState(0);
  const [filteredArray, setFilteredArray] = useState([]);
  const [finalArray, setFinalArray] = useState([]);

  const { account } = useWallet();
  const router = useRouter();

  const updateObArr = () => {
    const ob = orderBookArray;

    if (ob) setNftDataArray([]);
    if (ob) setNftDataArray(ob);

    forceCheck();
  };

  const fuse = new Fuse(nftDataArray, {
    keys: ["name", "description", "model_handle", "tags"],
    shouldSort: false,
    useExtendedSearch: true,
    includeScore: true,
  });

  let selectedOptionsStr = "";
  selectedOptions.forEach((e) => (selectedOptionsStr += `="${e.value}" `));

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
    totalItems: filteredArray ? filteredArray.length + 1 : 0,
    initialPageSize: 25,
  });

  const setSort = (sortBy) => {
    setSortBy(sortBy);
  };

  const startNumber = currentPage - 5 > 0 ? currentPage - 5 : 0;
  const endNumber = currentPage + 5 < totalPages ? currentPage + 5 : totalPages;

  let items = [];
  if (currentPage !== 0) {
    items.push(<Pagination.First onClick={() => setPage(0)} />)
  };
  if (currentPage !== 0) {
    items.push(<Pagination.Prev onClick={setPreviousPage} />)
  };

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
  if (currentPage !== totalPages - 1) {
    items.push(<Pagination.Next onClick={setNextPage} />)
  };
  if (currentPage !== totalPages - 1) {
    items.push(<Pagination.Last onClick={() => setPage(totalPages)} />)
  };

  useEffect(() => {
      updateObArr();
      forceUpdate();
  }, [orderBookArray])

  useEffect(() => {
    console.log("Setting final array")
    const newArray = filteredArray;
    newArray.sort((a, b) => {
        switch (sortBy) {
          case "Relevancy":
            return Number(a.score) - Number(b.score);
          case "Price Low to High":
            const aMaxSupply = Number(a.item.max_supply);
            const bMaxSupply = Number(b.item.max_supply);

            const aTotalMints = a.item.mints;
            const bTotalMints = b.item.mints;

            if (a.item.list_price === b.item.list_price) {
              // Compare mints if price is the same
              return bMaxSupply - bTotalMints - (aMaxSupply - aTotalMints);
            }
            return Number(a.item.list_price) - Number(b.item.list_price);
          case "Price High to Low":
            return Number(b.item.list_price) - Number(a.item.list_price);
          default:
            return new Date(b.item.createdAt) - new Date(a.item.createdAt);
        }
    })
    console.log({ newArray, filteredArray })
    setFinalArray(newArray);
  }, [filteredArray, sortBy]);

  useEffect(() => {
    // yes search + no dropdown
    console.log("Received new values")
    let searchResult;
    if (searchFilter !== "" && selectedOptionsStr === "") {
      searchResult = fuse.search({
        $or: [
          { name: searchFilter },
          { description: searchFilter },
          { model_handle: searchFilter },
        ],
      });

      // yes search + yes dropdown
    } else if (searchFilter !== "" && selectedOptionsStr !== "") {
      searchResult = fuse.search({
        $and: [{ tags: selectedOptionsStr }],
        $or: [{ name: searchFilter }],
      });

      // no search + yes dropdown
    } else if (searchFilter == "" && selectedOptionsStr !== "") {
      searchResult = fuse.search({
        $and: [{ tags: selectedOptionsStr }],
      });

      // no filtering
    } else {
      searchResult = nftDataArray.map((d, idx) => ({
        item: d,
        refIndex: idx,
      }));
    
    }
    console.log({nftDataArray, searchResult})
      setFilteredArray(searchResult);
  }, [searchFilter, selectedOptionsStr, nftDataArray]);

  useEffect(() => {
    const queryFilter = router.query.s;
    const persistedPageNumber = router.query.p;
    const persistedSortBy = router.query.sort;
    const tags = router.query.tags;
    setSearchFilter(queryFilter ?? "");
    setSort(persistedSortBy ?? "Recent");
    setPage(persistedPageNumber ? Number(persistedPageNumber) : 0);
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
        `${router.pathname}?${searchFilter && `s=${searchFilter}&`}${
          currentPage ? `p=${currentPage}&` : ""
        }${selectedOptionsStr ? `tags=${selectedOptionsStr}&` : ""}${
          sortBy ? `sort=${sortBy}&` : ""
        }`.trim(),
        undefined,
        { shallow: true }
      );
    }
  }, [searchFilter, sortBy, currentPage, selectedOptionsStr]);

  useEffect(() => {
    updateObArr();
    forceUpdate();
  }, [searchFilter, orderBookArray, sortBy, showPendingModal]);

  useEffect(() => {
    if (finalArray.length !== 0 && persistedPageNumber) {
      setPage(persistedPageNumber);
      setPersistedPageNumber(null);
    }
  }, [finalArray]);

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
              <a>
                <Button variant="primary  w-sm-100">
                  <b>{"Go to Resale Marketplace"}</b>
                </Button>
              </a>
            </Link>
          }
        />
        <div className="full-width-search white-tp-bg p-3 d-flex">
          <input
            placeholder="Type to search for a model or NFT..."
            type="text"
            className="flex-grow-1 pl-2"
            value={searchFilter}
            onChange={(e) => {
              setSearchFilter(e.target.value);
            }}
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
                  onClick={() => setSort("Relevancy")}
                  style={{
                    display: searchFilter === "" ? "none" : "block",
                  }}
                >
                  Relevancy
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setSort("Recent")}>
                  Most Recent
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setSort("Price Low to High")}>
                  Price Low to High
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setSort("Price High to Low")}>
                  Price High to Low
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>
        <br />
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
            {finalArray?.length === 0 && !error ? (
              <div
                style={{ minHeight: 500 }}
                className="d-flex justify-content-center align-items-center w-100"
              >
                <Loading custom="Loading... This may take up to a few minutes, please ensure your wallet is connected." />
              </div>
            ) : error ? (
              <ErrorFallback custom={"Failed to load NFTs"} />
            ) : (
              finalArray.length > 0 && (
                <>
                  {finalArray
                    .slice(startIndex, endIndex || finalArray.length)
                    .map((o, i) => (
                      <Order
                        searchFilter={searchFilter}
                        soldOut={o.item.mints === Number(o.item.max_supply)}
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
