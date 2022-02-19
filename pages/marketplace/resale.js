import useSWR from "swr";
import { useWallet } from "use-wallet";
import Dropdown from "react-bootstrap/Dropdown";
import Button from "react-bootstrap/Button";
import React, { useState, useEffect, useReducer, useMemo } from "react";
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
import Link from "next/link";
import BigNumber from "bignumber.js";
import axios from "axios";
import Select from "react-select";
import ErrorFallback from "../../components/Fallback/Error";
import { useRouter } from "next/dist/client/router";
import PaginationComponentV2 from "../../components/Pagination";
import MyNFTItemSkeleton from "../../components/Skeleton/MyNFTItemSkeleton";

const Marketplace = ({ search }) => {
  const maxId = useGetMaxIdForSale();

  const [selectedOptions, setSelectedOptions] = useState([]);
  const [cancelOrderData, setCancelOrderData] = useState(null);
  const [purchaseOrderData, setPurchaseOrderData] = useState(null);
  const [showPendingModal, setShowPendingModal] = useState(null);
  const [showCompleteModal, setShowCompleteModal] = useState(null);
  const [_orderBookArray, setOrderBookArray] = useState([]);
  const [_renderArray, setRenderArray] = useState([]);
  const [searchFilter, setSearchFilter] = useState(search || "");
  const [sortBy, setSortBy] = useState("Recent");
  const [jsonBody, setJsonBody] = useState(null);
  const [orderBookLoaded, setOrderBookLoaded] = useState(false);
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

  const [orderBook] = useGetAllOpenOrders(maxId);
  const { account } = useWallet();
  const router = useRouter();

  const { error, docs: populatedNftData } = apiResponseData;

  useEffect(() => {
    if (orderBook?.length > 0 && !orderBookLoaded) {
      const orderBookArray = orderBook.flat();
      const jsonBody = { nfts: orderBookArray.map((o) => o.nftId) };
      setJsonBody(jsonBody);
      setOrderBookArray(orderBookArray);
      setOrderBookLoaded(true);
      return;
    }
  }, [orderBook]);

  useEffect(() => {
    const queryFilter = router.query.s;
    setSearchFilter(queryFilter ?? "");
  }, []);

  useEffect(() => {
    const sort =
      sortBy === "Recent"
        ? "recent"
        : sortBy === "Price Low to High"
        ? "asc"
        : "desc";

    router.push(
      `${router.pathname}?p=1&sort=${sort}${
        searchFilter && `&s=${searchFilter}`
      }`.trim(),
      undefined,
      { shallow: true }
    );
  }, [searchFilter, sortBy]);

  useEffect(() => {
    if (jsonBody && orderBookLoaded) {
      setLoading(true);
      axios
        .post(
          `/api/nft/get-many-nfts?p=${router.query.p ?? 1}${
            searchFilter ? `&s=${router.query.s}` : ""
          }&sort=${router.query.sort ?? "recent"}`,
          {
            ...jsonBody,
          }
        )
        .then((res) => setApiResponseData(res.data))
        .then(() => setLoading(false));
    }
  }, [router, jsonBody, _orderBookArray]);

  useEffect(() => {
    const sort =
      sortBy === "Recent"
        ? "recent"
        : sortBy === "Price Low to High"
        ? "asc"
        : "desc";
    router.push(
      `${router.pathname}?${
        searchFilter && `s=${searchFilter}`
      }&p=1&sort=${sort}`,
      undefined,
      { shallow: true }
    );
  }, [searchFilter, sortBy]);

  useEffect(() => {
    const populatedArray =
      _orderBookArray &&
      populatedNftData &&
      populatedNftData
        .map((x) => {
          const nftResult = _orderBookArray?.find(
            (orderBookNft) => x.nftId === orderBookNft.id
          );
          if (!nftResult) return undefined;
          return { item: { ...x, ...nftResult } };
        })
        .filter((e) => e);

    const renderArray = populatedArray;
    setRenderArray(renderArray);
  }, [_orderBookArray, populatedNftData]);

  const navigate = (page) => {
    window.scrollTo(0, 0);
    const sort =
      sortBy === "Recent"
        ? "recent"
        : sortBy === "Price Low to High"
        ? "asc"
        : "desc";
    router.push(
      `${router.pathname}?${
        searchFilter && `s=${searchFilter}&`
      }p=${page}&sort=${sort}`,
      undefined,
      { shallow: true }
    );
  };

  console.log(_renderArray);

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

      <div className="">
        <Hero
          title={"Resale Marketplace"}
          subtitle={`The brand new official Treat resale marketplaces!`}
          additionalContent={
            <>
              <p
                className="totw-secondary-text"
                style={{ maxWidth: "none", marginTop: -12, fontSize: "0.95em" }}
              >
                Total: {_renderArray ? _renderArray.length : "Loading..."}
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
            {loading || !_renderArray || _renderArray.length === 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 w-full container mx-auto">
                {new Array(12).fill(0).map((_, i) => (
                  <MyNFTItemSkeleton key={i} className="col-span-1" />
                ))}
              </div>
            ) : error ? (
              <ErrorFallback custom="Error loading page" />
            ) : (
              <>
                {_renderArray.map((o, i) => {
                  return (
                    <Order
                      searchFilter={searchFilter}
                      nftResult={{ ...o.item._doc, ...o.item }}
                      index={o.refIndex}
                      order={o.item}
                      account={account}
                      key={o.refIndex}
                      setPendingModal={setShowPendingModal}
                      openCompleteModal={() => setShowCompleteModal(true)}
                      setCancelOrderData={setCancelOrderData}
                      setPurchaseOrderData={setPurchaseOrderData}
                    />
                  );
                })}
              </>
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
