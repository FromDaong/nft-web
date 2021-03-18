import React, { useState, useEffect } from "react";
import Spinner from "react-bootstrap/Spinner";
import Nav from "react-bootstrap/Nav";
import MyNFTItem from "../components/MyNFTItem";
import useGetNftMaxSupply from "../hooks/useGetNftMaxSupply";
import useGetNftTotalSupply from "../hooks/useGetNftTotalSupply";
import useWallet from "use-wallet";

const nftData = {
  mints: [],
  _id: "605182f3c7fccba1cf1d20d8",
  name: "Let's $TREAT You",
  description: "This is a test description",
  external_url: "https://treatdao.com/",
  image:
    "https://ipfs.infura.io:5001/api/v0/cat/QmTbc3CtfY1QaWMuyXUmhqeTgQsCM6SjokeZwsyLgjyPpZ",
  model_bnb_address: "0x9853434112De1B46B19d9D4495d47A21fA6c7B8e",
  attributes: [
    {
      _id: "605182f3c7fccba1cf1d20d9",
      trait_type: "Model",
      value: "@TreatDAO",
    },
    {
      _id: "605182f3c7fccba1cf1d20da",
      trait_type: "Max Supply",
      value: "1500",
    },
  ],
  createdAt: "2021-03-17T04:17:55.618Z",
  __v: 0,
  id: 2,
  list_price: 0.8,
  model_profile_pic:
    "https://pbs.twimg.com/profile_images/1368751929829056514/84hhopm4_400x400.jpg",
  model_handle: "@TreatDAO",
  max_supply: "150",
};

const MyNFTsWrapper = () => {
  const { account, status } = useWallet();
  if (status !== "connected") {
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
          Please make sure your wallet on the Binance Smart Chain is connected.
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
  } else {
    console.log({ account });
    return <ViewNFT account={account} />;
  }
};

const ViewNFT = ({ account }) => {
  const maxNftSupply = useGetNftMaxSupply(account);
  const mintedNfts = useGetNftTotalSupply(account);

  const data = {
    id: 2,
    edition: "1 OF 1",
    name: "Morning Wood",
    price: 1.05,
    creator_share: 80,
    creator: {
      profile_pic:
        "https://pbs.twimg.com/profile_images/1357419789040439302/lmUkL7j__400x400.jpg",
      name: "alenaxbt",
    },
    placeholder_image: "",
  };

  console.log(maxNftSupply);

  return (
    <div className="container">
      <div className="white-container row mt-3">
        <div className="col-lg-12 text-container container mt-4 mt-lg-0 pt-2">
          <h5 className="history-title ">
            <b>Wallet:</b> <span style={{ color: "#999" }}>{account}</span>
          </h5>
        </div>
      </div>
      <div className="mt-2">
        {/* <Nav variant="pills" defaultActiveKey="/home">
            <Nav.Item>
              <Nav.Link href="/home">Active</Nav.Link>
            </Nav.Item>
            </Nav.Item>
          </Nav> */}
        <h2 className="pt-4 pb-2">
          <b>My NFTs:</b>
        </h2>
        {nftData ? (
          <div className="row d-flex flex-wrap">
            <div className="col-md-4 px-4">
              <MyNFTItem data={nftData} />
            </div>
            <div className="col-md-4 px-4">
              <MyNFTItem data={nftData} />
            </div>
            <div className="col-md-4 px-4">
              <MyNFTItem data={nftData} />
            </div>
          </div>
        ) : (
          <div>You haven't got any NFTs yet.</div>
        )}
      </div>
    </div>
  );
};

export default MyNFTsWrapper;
