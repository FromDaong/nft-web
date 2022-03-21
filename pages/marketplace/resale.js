import { useEffect, useState } from "react";

import { AnimateSharedLayout } from "framer-motion";
import BlankModal from "../../components/BlankModal";
import {Button} from "@chakra-ui/react"import CancelOrderModal from "../../components/CancelOrderModal";
import Dropdown from "react-bootstrap/Dropdown";
import ErrorFallback from "../../components/Fallback/Error";
import Hero from "../../components/Hero";
import Link from "next/link";
import MyNFTItemSkeleton from "../../components/Skeleton/MyNFTItemSkeleton";
import { Order } from "../../components/MarketplaceListItem";
import PaginationComponentV2 from "../../components/Pagination";
import PurchaseOrderModal from "../../components/PurchaseOrderModal";
import Select from "react-select";
import axios from "axios";
import tags from "../../utils/tags";
import useGetAllOpenOrders from "../../hooks/useGetAllOpenOrders";
import useGetMaxIdForSale from "../../hooks/useGetMaxIdForSale";
import { useMoralis } from "react-moralis";
import { useRouter } from "next/dist/client/router";

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
  const { account } = useMoralis();
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
    const sort = router.query.sort;
    const tags = router.query.tags;

    const sortTag =
      sort === "recent"
        ? "Recent"
        : sort === "desc"
        ? "Price High to Low"
        : "Price Low to High";
    setSearchFilter(queryFilter ?? "");
    setSortBy(sortTag);
    try {
      const tagsArray = tags
        ? atob(tags)
            .split(",")
            .map((tag) => ({
              value: tag,
              label: tag.charAt(0).toUpperCase() + tag.slice(1),
            }))
        : [];
      setSelectedOptions(tagsArray);
    } catch (err) {
      console.log(err);
    }
  }, []);

  useEffect(() => {
    navigate(1);
  }, [searchFilter, sortBy, selectedOptions]);

  useEffect(() => {
    if (jsonBody && orderBookLoaded) {
      setLoading(true);
      axios
        .post(
          `/api/nft/get-many-nfts?p=${router.query.p ?? 1}${
            searchFilter ? `&s=${router.query.s}` : ""
          }&sort=${router.query.sort ?? "asc"}${
            router.query.tags ? `&tags=${router.query.tags}` : ""
          }`,
          {
            ...jsonBody,
          }
        )
        .then((res) => setApiResponseData(res.data))
        .then(() => setLoading(false));
    }
  }, [router, jsonBody, _orderBookArray]);

  useEffect(() => {
    const populatedArray =
      _orderBookArray &&
      populatedNftData &&
      populatedNftData
        .map((x) => {
          const nftResult = _orderBookArray.find(
            (orderBookNft) => x.id === orderBookNft.nftId
          );
          if (!nftResult) return undefined;
          return { item: { ...x, ...nftResult } };
        })
        .filter((e) => e);

    const renderArray = populatedArray ?? [];
    setRenderArray(renderArray);
  }, [_orderBookArray, populatedNftData]);

  const navigate = (page) => {
    window.scrollTo(0, 0);
    const tags = btoa(selectedOptions.map((option) => option.value));

    const sort =
      sortBy === "Recent"
        ? "recent"
        : sortBy === "Price High to Low"
        ? "desc"
        : "asc";
    router.push(
      `${router.pathname}?${
        searchFilter && `s=${searchFilter}`
      }&p=${page}&sort=${sort}${tags.length > 0 ? `&tags=${tags}` : ""}`,
      undefined,
      { shallow: true }
    );
  };

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
            {!loading ? (
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
            ) : loading || !_renderArray ? (
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "center",
                }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-8 w-full container mx-auto"
              >
                {new Array(12).fill(0).map((_, i) => (
                  <MyNFTItemSkeleton key={i} className="col-span-1" />
                ))}
              </div>
            ) : (
              <ErrorFallback custom="Error loading page" />
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
