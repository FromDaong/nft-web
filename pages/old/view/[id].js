/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import {
  ArrowUpRightSquare,
  Bag,
  EyeSlash,
  ShopWindow,
} from "react-bootstrap-icons";
import { Nav, Tab } from "react-bootstrap";
import { gql, useQuery } from "@apollo/client";
import { useEffect, useState } from "react";

import Axios from "axios";
import Badge from "react-bootstrap/Badge";
import BigNumber from "bignumber.js";
import { Blurhash } from "react-blurhash";
import { Button } from "@chakra-ui/react";
import Dropdown from "react-bootstrap/Dropdown";
import ErrorFallback from "../../components/Fallback/Error";
import Layout from "../../components/Layout";
import Link from "next/link";
import NFTPurchaseModal from "../../components/NFTPurchaseModal";
import Spinner from "react-bootstrap/Spinner";
import Web3 from "web3";
import { generateFromString } from "generate-avatar";
import getCreatorNftCost from "../../hooks/useGetCreatorNftCost";
import { getDisplayBalance } from "../../utils/formatBalance";
import getSubscriberNftCost from "../../hooks/useGetSubscriberNftCost";
import useGetFreeCreatorTreat from "../../hooks/useGetFreeCreatorTreat";
import useGetFreeSubscriberTreat from "../../hooks/useGetFreeSubscriberTreat";
import useGetFreeTreat from "../../hooks/useGetFreeTreat";
import useGetIsSubscribed from "../../hooks/useGetIsSubscribed";
import useGetNftMaxSupply from "../../hooks/useGetNftMaxSupply";
import useGetNftTotalSupply from "../../hooks/useGetNftTotalSupply";
import useGetOpenOrdersForNft from "../../hooks/useGetOpenOrdersForNft";
import useGetTreatNFTCost from "../../hooks/useGetTreatNftCost";
import useMintCreatorNft from "../../hooks/useMintCreatorNft";
import useMintNft from "../../hooks/useMintNft";
import useMintSubcriberNft from "../../hooks/useMintSubscriberNft";
import { useMoralis } from "react-moralis";
import { useRouter } from "next/router";

const RedeemButton = ({ onMintNft, remainingNfts, nftData, setShowModal }) => {
  const { account } = useMoralis();

  const [disabled, setDisabled] = useState(false);
  const [confirmWallet, setConfrimWallet] = useState(false);
  const isSubscribed = useGetIsSubscribed(nftData.model_bnb_address || "");

  const isOldTotw =
    (nftData.old_totw && !nftData.totw) || (nftData.old_totm && !nftData.totm);

  if (
    remainingNfts.toNumber() < 0 ||
    isNaN(remainingNfts.toNumber()) ||
    !nftData
  ) {
    return (
      <Spinner animation="border" role="status" className="p3 mt-3 mb-2">
        <span className="sr-only">Loading...</span>
      </Spinner>
    );
  }

  if (nftData.melon_nft) return null;

  return (
    <Button
      mt={3}
      className="bg-primary text-white font-bold"
      isFullWidth
      style={{ borderRadius: 7 }}
      disabled={
        disabled ||
        remainingNfts.toNumber() === 0 ||
        isOldTotw ||
        (nftData.subscription_nft && !isSubscribed)
      }
      onClick={async () => {
        setDisabled(true);
        setConfrimWallet(true);

        const txHash = await onMintNft();

        if (!txHash) {
          setDisabled(false);
          return;
        }

        setConfrimWallet(false);
        setShowModal(true);

        // const txHash = "0x1234";
        const mint = {
          transactionHash: txHash.transactionHash,
          nftId: nftData.id,
          buyer: account,
          price: nftData.list_price,
          timestamp: new Date(),
        };
        localStorage.setItem("tx", JSON.stringify(mint));
        setDisabled(false);
      }}
    >
      {disabled ? (
        <div>
          <Spinner
            animation="border"
            role="status"
            style={{ marginRight: 4, marginBottom: 1 }}
            size="sm"
          >
            <span className="sr-only">Loading...</span>
          </Spinner>
          <span>
            {confirmWallet
              ? " Please confirm in your wallet and wait"
              : "Please wait..."}
          </span>
        </div>
      ) : (
        <b>
          {remainingNfts.toNumber() > 0 &&
            !isOldTotw &&
            !nftData.subscription_nft &&
            `Buy Now`}
          {(remainingNfts.toNumber() === 0 || isOldTotw) && `Sold Out`}
          {nftData.subscription_nft &&
            remainingNfts.toNumber() > 0 &&
            `Buy Subscription NFT`}
        </b>
      )}
    </Button>
  );
};

const ViewNFTWrapper = () => {
  const [error, setErr] = useState(null);
  const [nftData, setNftData] = useState();
  const router = useRouter();
  const { id } = router.query;
  console.log({ id });

  useEffect(() => {
   if(id) {
      Axios.get(`/api/v2/nft/${id}`)
        .then((res) => {
          setNftData(res.data);
        })
        .catch((err) => setErr(err));
   }
  }, [id]);

  if (!nftData) {
    return (
      <div
        style={{
          position: "fixed",
          width: "100%",
          height: "100%",
          display: "flex",
          top: 0,
          left: 0,
          justifyContent: "center",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h5
          style={{
            fontWeight: "bolder",
            background: "white",
            borderRadius: 5,
            padding: 10,
          }}
        >
          Please make sure your Binance Smart Chain wallet is connected.
        </h5>
        <Spinner
          animation="border"
          role="status"
          size="xl"
          style={{ marginTop: 5 }}
        >
          <span className="sr-only">Loading...</span>
        </Spinner>
      </div>
    );
  } else if (error) {
    return <ErrorFallback custom="Could not load NFT" />;
  } else {
    return <ViewNFT nftData={nftData} />;
  }
};

const ViewNFT = ({ nftData, account }) => {
  const totwNftCost = useGetTreatNFTCost(nftData.id);
  const creatorNftCost = getCreatorNftCost(nftData.id);
  const subscriberNftCost = getSubscriberNftCost(nftData.id);
  const [sortBy, setSortBy] = useState("Price Low to High");

  let nftCost = nftData.old_totw ? totwNftCost : creatorNftCost;
  nftCost = nftData.subscription_nft ? subscriberNftCost : nftCost;
  nftCost = nftData.old_totm ? totwNftCost : nftCost;

  const maxNftSupply = useGetNftMaxSupply(nftData.id);
  const mintedNfts = useGetNftTotalSupply(nftData.id);
  const remainingNfts = maxNftSupply.minus(mintedNfts);
  const { onMintNft: onMintTotwNft } = useMintNft(nftData.id, nftCost);
  const { onMintCreatorNft } = useMintCreatorNft(nftData.id, nftCost);
  const { onMintSubscriberNft } = useMintSubcriberNft(nftData.id, nftCost);

  const [showModal, setShowModal] = useState(false);
  const { onGetFreeTreat } = useGetFreeTreat(nftData.id, nftCost);
  const { onGetFreeCreatorTreat } = useGetFreeCreatorTreat(nftData.id, nftCost);
  const { onGetFreeSubscriberTreat } = useGetFreeSubscriberTreat(
    nftData.id,
    nftCost
  );

  const openOrders = useGetOpenOrdersForNft(nftData.id) ?? [];
  // Get lowest price value in open orders
  const lowestOpenOrder = new BigNumber(
    openOrders.reduce(
      (lowest, order, index) => {
        const price = new BigNumber(order.price);
        const lowestPrice = new BigNumber(lowest.price);
        if (index === 0) return order;
        return price.lt(lowestPrice) ? order : lowest;
      },
      { price: 0 }
    ).price
  );

  const {
    loading: loadingResaleHistory,
    error: errorResaleHistory,
    data: resaleHistoryData,
  } = useQuery(
    gql`
      query getSales($first: Int, $orderBy: String, $orderDirection: String) {
        sales(
          first: 200,
          orderBy: "cost",
          orderDirection: "asc",
          where: {
            treatsPurchased_contains: [${nftData.id}],
            sourceContract: "0xA38978E839c08046FA80B0fee55736253Ab3B8a3"
          }
        ) {
          id
          cost
          sourceContract
          treatsPurchased
          seller
          buyer
          purchaseDate
        }
      }
    `,
    {
      variables: { language: "english" },
    }
  );

  const {
    loading: loadingMintHistory,
    error: _errorMintHistory,
    data: mintHistoryData,
  } = useQuery(
    gql`
      query getSales($first: Int) {
        sales(
          first: 200
          where: {
            treatsPurchased_contains: [${nftData.id}],
            sourceContract_not_in: ["0xA38978E839c08046FA80B0fee55736253Ab3B8a3","0xe0f5df4915242e4c4c06d2964eda53c448fec442"]
          }
        ) {
          id
          cost
          sourceContract
          treatsPurchased
          seller
          buyer
          purchaseDate
        }
      }
    `,
    {
      variables: { language: "english" },
    }
  );

  let allData = [];
  if (resaleHistoryData && mintHistoryData) {
    allData.push([
      ...resaleHistoryData.sales.map((sale) => ({
        ...sale,
        transactionType: "resale",
      })),
      ...mintHistoryData.sales.map((sale) => ({
        ...sale,
        transactionType: "mint",
      })),
    ]);
  }

  allData = allData.flat();
  // Sort all data by recency
  allData.sort((a, b) => {
    const aDate = new Number(a.purchaseDate);
    const bDate = new Number(b.purchaseDate);
    return aDate > bDate ? -1 : 1;
  });
  const loadingHistory = loadingMintHistory && loadingResaleHistory;

  const onMintNft = async () => {
    if (nftData.subscription_nft) return onMintSubscriberNft();
    if (nftData.old_totw || nftData.old_totm) {
      return await onMintTotwNft();
    } else {
      return await onMintCreatorNft();
    }
  };

  const onMintFreeNft = async () => {
    if (nftData.subscription_nft) return onGetFreeSubscriberTreat();
    if (nftData.old_totw || nftData.old_totm) {
      return await onGetFreeTreat();
    } else {
      return await onGetFreeCreatorTreat();
    }
  };

  /*
  const historyEvents = nftData.mints.map((m) => {
    return {
      when: m.timestamp.toString(),
      event: `${m.buyer} bought for ${m.price}`, // TODO: look up username from account
    };
  });
  */

  const setSort = (sortBy) => {
    setSortBy(sortBy);
  };

  const sortedArray = openOrders.sort((a, b) => {
    switch (sortBy) {
      case "Recent":
        return Number(a.listDate) - Number(b.listDate);
      case "Price Low to High":
        return Number(a.price) - Number(b.price);
      case "Price High to Low":
        return Number(b.price) - Number(a.price);
      default:
        return Number(a.listDate) - Number(b.listDate);
    }
  });

  const purchaseHistoryRender = allData.map((e) => (
    <div
      key={e.purchaseDate}
      className="history-event d-flex justify-content-between"
    >
      <div className="d-flex align-items-center">
        <div className="pic">
          {e.transactionType === "mint" ? (
            <Bag size={32} style={{ color: "DA5184" }} />
          ) : (
            <ShopWindow size={32} style={{ color: "DA5184" }} />
          )}
        </div>
        <div className="details">
          <div className="label">
            {`${new Date(
              e.purchaseDate * 1000
            ).toLocaleDateString()} at ${new Date(
              e.purchaseDate * 1000
            ).toLocaleTimeString()}`}
          </div>
          <div className="event">
            {e.buyer.substring(0, 6)}...{e.buyer.substr(-5)}{" "}
            {e.transactionType === "mint" ? "purchased" : "bought a resale"} for{" "}
            <b>{Web3.utils.fromWei(e.cost)}</b>
          </div>
        </div>
      </div>
      <div>
        <a
          href={"https://bscscan.com/tx/" + e.id}
          target="_blank"
          rel="noreferrer"
        >
          <ArrowUpRightSquare size={24} />
        </a>
      </div>
    </div>
  ));

  // Sort with lowest first
  const openOrdersRender = sortedArray.map((e) => (
    <Link
      key={nftData.name}
      href={`/marketplace/resale?search=${nftData.name}`}
      passHref={true}
    >
      <a>
        <div className="history-event">
          <div className="pic">
            <ShopWindow size={35} style={{ color: "DA5184" }} />
          </div>
          <div className="details">
            <div className="label">{e.seller}</div>
            <div className="event">
              is selling theirs for {getDisplayBalance(new BigNumber(e.price))}
              BNB
            </div>
          </div>
        </div>
      </a>
    </Link>
  ));

  return (
    <Layout>
      <div className="container">
        <NFTPurchaseModal
          handleClose={() => setShowModal(false)}
          show={showModal}
        />
        <div className="view-nft row">
          <div className="image-wrapper col-lg-4 p-0 pr-lg-3">
            <div className="image-container text-center text-lg-left">
              <div style={{ position: "relative", width: "100%" }}>
                {nftData.image ? (
                  <img src={nftData.image} className="dynamic-image" />
                ) : (
                  <>
                    <div className="info-overlay">
                      <EyeSlash size={32} />
                      <div>Purchase to View</div>
                    </div>
                    <Blurhash
                      style={{
                        borderRadius: 8,
                        overflow: "hidden",
                      }}
                      hash={nftData.blurhash}
                      width={"100%"}
                      height={375}
                      resolutionX={32}
                      resolutionY={32}
                      punch={1}
                    />
                  </>
                )}
              </div>
              <RedeemButton
                onMintNft={nftData.list_price === 0 ? onMintFreeNft : onMintNft}
                remainingNfts={remainingNfts}
                nftData={nftData}
                setShowModal={setShowModal}
                account={account}
              />
            </div>
          </div>
          <div className="col-lg-8 text-container container mt-4 mt-lg-0">
            <div className="title-section">
              {/* <div className="edition mb-1"> */}
              {/* <div>REMAINING: {remainingNfts.toNumber()}</div> */}
              <div>
                {nftData.totw && (
                  <div className="edition mb-2">AVAILABLE THIS WEEK ONLY</div>
                )}
                {!nftData.old_totw &&
                  !nftData.old_totm &&
                  nftData.max_supply &&
                  nftData.max_supply < 100000 && (
                    <div className="edition mb-2">
                      Remaining Supply:{" "}
                      {remainingNfts && remainingNfts.toNumber()} / Max Supply:{" "}
                      {nftData.maxSupply}
                    </div>
                  )}
                {nftData.melon_nft && (
                  <div className="edition mb-4 text-success">
                    Available exclusively on Farmers' Market
                  </div>
                )}
                <div className="title">{nftData.name}</div>
                <div className="bio">{nftData.description}</div>
                <div className="tags mt-2">
                  {nftData.tags &&
                    nftData.tags.map((tag, i) => (
                      <Badge key={i} variant="secondary mr-2">
                        {tag}
                      </Badge>
                    ))}
                </div>
              </div>
            </div>
            <div className="stats">
              <div className="stat">
                <div className="label">List Price</div>
                <div className="number">{getDisplayBalance(nftCost)} BNB</div>
              </div>
              {openOrders.length > 0 && (
                <div className="stat">
                  <div className="label">Floor Price</div>
                  <div className="number">
                    {getDisplayBalance(lowestOpenOrder)} BNB
                  </div>
                </div>
              )}
              {/* <div className="stat">
              <div className="label">CREATOR SHARE</div>
              <div className="number">75%</div>
            </div> */}
            </div>
            <div className="creator-wrapper">
              <Link href={`/creator/${nftData.model_handle}`}>
                <a className="creator">
                  <div className="pic">
                    <img
                      src={
                        nftData.model_profile_pic ||
                        `data:image/svg+xml;utf8,${generateFromString(
                          nftData.model_handle
                        )}`
                      }
                    />
                  </div>
                  <div className="details">
                    <div className="label">Creator</div>
                    <div className="name">{nftData.model_handle}</div>
                  </div>
                </a>
              </Link>
            </div>
            <hr style={{ marginTop: 25, marginBottom: 25 }} />
            <Tab.Container defaultActiveKey="resale" id="id">
              <Nav variant="pills" fill className="mb-4">
                <Nav.Item>
                  <Nav.Link eventKey="resale">Resale Listings</Nav.Link>
                </Nav.Item>
                {+nftData.id > 0 && (
                  <Nav.Item>
                    <Nav.Link eventKey="purchase_history">
                      Purchase History
                    </Nav.Link>
                  </Nav.Item>
                )}
              </Nav>
              <Tab.Content>
                <Tab.Pane eventKey="resale" title="Resale Listings">
                  <div className="history-container">
                    <div className="history-title text-center mt-2">
                      Resale Marketplace Listings
                    </div>
                    <div
                      className="bio"
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <p>
                        Total currently listed:{" "}
                        {openOrdersRender && openOrdersRender.length}
                      </p>
                      <div>
                        <Dropdown>
                          <Dropdown.Toggle
                            variant="transparent"
                            id="dropdown-basic"
                            size="lg"
                          >
                            {sortBy}
                          </Dropdown.Toggle>
                          <Dropdown.Menu>
                            <Dropdown.Item onClick={() => setSort("Recent")}>
                              Most Recent
                            </Dropdown.Item>
                            <Dropdown.Item
                              onClick={() => setSort("Price Low to High")}
                            >
                              Price Low to High
                            </Dropdown.Item>
                            <Dropdown.Item
                              onClick={() => setSort("Price High to Low")}
                            >
                              Price High to Low
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </div>
                    </div>
                    {/* <div className="bio">Coming soon...</div> */}
                    <div className="history-events">{openOrdersRender}</div>
                  </div>
                </Tab.Pane>
                <Tab.Pane eventKey="purchase_history" title="Purchase History">
                  <div className="history-container">
                    <div className="history-title text-center mt-2">
                      Purchase History
                    </div>
                    {loadingHistory ? (
                      <div className="bio text-center">Loading...</div>
                    ) : (
                      <div className="bio text-center">
                        Total minted: {allData && allData.length}
                      </div>
                    )}
                    <div className="history-events">
                      {purchaseHistoryRender}
                    </div>
                  </div>
                </Tab.Pane>
              </Tab.Content>
            </Tab.Container>
          </div>
        </div>
      </div>
    </Layout>
  );
};

const ViewNFTPage = ({ id }) => {
  return <ViewNFTWrapper id={id} />;
};

ViewNFTWrapper.getInitialProps = async ({ query: { id } }) => {
  return { id };
};

export default ViewNFTPage;
