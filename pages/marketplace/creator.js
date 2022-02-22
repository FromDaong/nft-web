import { useWallet } from "use-wallet";
import Dropdown from "react-bootstrap/Dropdown";
import Button from "react-bootstrap/Button";
import React, { useState, useEffect, useReducer } from "react";
import Loading from "../../components/Loading";
import Link from "next/link";
import tags from "../../utils/tags";
import Hero from "../../components/Hero";
import { Order } from "../../components/CreatorMarketplaceListItem";
import { motion, AnimateSharedLayout } from "framer-motion";
import { forceCheck } from "react-lazyload";
import axios from "axios";
import Fuse from "fuse.js";
import Select from "react-select";
import { useRouter } from "next/dist/client/router";
import ErrorFallback from "../../components/Fallback/Error";
import PaginationComponentV2 from "../../components/Pagination";

// TODO: Fetch NFTs from blockchain
// database seems to be outdated

const Marketplace = ({ search }) => {
  const [_, forceUpdate] = useReducer((x) => x + 1, 0);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [purchaseOrderData, setPurchaseOrderData] = useState(null);
  const [showPendingModal, setShowPendingModal] = useState(null);
  const [nftDataArray, setNftDataArray] = useState([]);
  const [searchFilter, setSearchFilter] = useState(search || "");
  const [sortBy, setSortBy] = useState("Recent");
  const [finalArray, setFinalArray] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiResponseData, setApiResponseData] = useState({
    docs: [],
    hasNextPage: false,
    hasPrevPage: false,
    totalPages: 1,
    totalDocs: 0,
    page: 1,
    error: null,
  });

  const { error, docs: orderBookArray } = apiResponseData;
  const { account } = useWallet();
  const router = useRouter();

  const updateObArr = () => {
    const ob = orderBookArray;

    if (ob) setNftDataArray([]);
    if (ob) setNftDataArray(ob);

    forceCheck();
  };

  const setSort = (sortBy) => {
    setSortBy(sortBy);
  };

  useEffect(() => {
    updateObArr();
    forceUpdate();
  }, [orderBookArray]);

  useEffect(() => {
    const newArray = nftDataArray.map((nft) => ({ item: nft }));
    setFinalArray(newArray);
  }, [nftDataArray, sortBy]);

  useEffect(() => {
    const queryFilter = router.query.s;
    const sort = router.query.sort;

    const sortTag =
      sort === "recent"
        ? "Recent"
        : sort === "asc"
        ? "Price Low to High"
        : "Price High to Low";
    setSearchFilter(queryFilter ?? "");
    setSortBy(sortTag ?? "Recent");
  }, []);

  useEffect(() => {
    const sort =
      sortBy === "Recent"
        ? "recent"
        : sortBy === "Price High to Low"
        ? "desc"
        : "asc";
    router.push(
      `${router.pathname}?${
        searchFilter && `s=${searchFilter}`
      }&p=1&sort=${sort}`,
      undefined,
      { shallow: true }
    );
  }, [searchFilter, sortBy]);

  useEffect(() => {
    console.log("Route changed");
    setLoading(true);
    axios
      .get(
        `/api/nft?p=${router.query.p ?? 1}${
          searchFilter ? `&s=${router.query.s}` : ""
        }&sort=${router.query.sort ?? "recent"}`
      )
      .then((res) => setApiResponseData(res.data))
      .then(() => setLoading(false));
  }, [router]);

  const navigate = (page) => {
    window.scrollTo(0, 0);
    const sort =
      sortBy === "Recent"
        ? "recent"
        : sortBy === "Price High to Low"
        ? "desc"
        : "asc";
    router.push(
      `${router.pathname}?${
        searchFilter && `s=${searchFilter}&`
      }p=${page}&sort=${sort}`,
      undefined,
      { shallow: true }
    );
  };

  useEffect(() => {
    updateObArr();
    forceUpdate();
  }, [searchFilter, orderBookArray, sortBy, showPendingModal]);

  console.log({ error, finalArray, orderBookArray });

  return (
    <AnimateSharedLayout>
      <div
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
          <div
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
            {loading ? (
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
                  {finalArray.map((o, i) => (
                    <Order
                      searchFilter={searchFilter}
                      soldOut={o.item.mints === Number(o.item.max_supply)}
                      nftResult={o.item}
                      index={i}
                      order={o.item}
                      account={account}
                      key={o.refIndex}
                      setPendingModal={setShowPendingModal}
                      openCompleteModal={() => ({})}
                      setPurchaseOrderData={setPurchaseOrderData}
                    />
                  ))}
                </>
              )
            )}
          </div>

          <div className="d-flex justify-content-center">
            <PaginationComponentV2
              hasNextPage={apiResponseData.hasNextPage}
              hasPrevPage={apiResponseData.hasPrevPage}
              totalPages={apiResponseData.totalPages}
              totalDocs={apiResponseData.totalDocs}
              page={apiResponseData.page}
              goNext={() => navigate(Number(apiResponseData.page) + 1)}
              goPrev={() => navigate(Number(apiResponseData.page) - 1)}
              loading={loading}
              setPage={(page) => navigate(Number(page))}
            />
          </div>
        </div>
      </div>
    </AnimateSharedLayout>
  );
};

Marketplace.getInitialProps = async ({ query: { search } }) => {
  return { search };
};

export default Marketplace;
