import React, { useState, useEffect } from "react";
import Spinner from "react-bootstrap/Spinner";
import Nav from "react-bootstrap/Nav";
import MyNFTItem from "../components/MyNFTItem";
import useGetNftMaxSupply from "../hooks/useGetNftMaxSupply";
import useGetNftBalance from "../hooks/useGetNftBalance";
import useGetNftTotalSupply from "../hooks/useGetNftTotalSupply";
import useWallet from "use-wallet";
import useSWR from "swr";

const MyNFTsWrapper = () => {
  const { account, status } = useWallet();

  const { data: res } = useSWR(`/api/nft`);
  const [nftArray, setNftData] = useState();

  useEffect(() => {
    (async () => {
      console.log({ res });
      if (res) {
        setNftData(res);
      }
    })();
  }, [res]);

  if (status !== "connected" || !nftArray) {
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
    return <ViewNFT account={account} nftArray={nftArray} />;
  }
};

const ViewNFT = ({ account, nftArray }) => {
  // const [nftArray, setNftData] = useState();

  const maxNftSupply = useGetNftMaxSupply(account);
  const mintedNfts = useGetNftTotalSupply(account);
  const nftBalances = useGetNftBalance(nftArray);

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
    <div className="container text-center">
      <div className="white-container mt-3 pt-4 px-4 d-inline-block">
        <h5 className="" style={{ wordBreak: "break-word" }}>
          <b>Connected wallet address:</b>
          <br />
          <div style={{ color: "#999", marginTop: 4 }}>{account}</div>
        </h5>
      </div>
      <div className="mt-2">
        {/* <Nav variant="pills" defaultActiveKey="/home">
            <Nav.Item>
              <Nav.Link href="/home">Active</Nav.Link>
            </Nav.Item>
            </Nav.Item>
          </Nav> */}
        <h2 className="pt-5 pb-4 w-100 text-center">
          <div className="heading-text">My NFTs</div>
        </h2>
        {nftBalances ? (
          <div className="row d-flex flex-wrap text-left">
            {nftBalances.map((nft) => {
              console.log({ nft });
              return (
                <div className="col-xl-3 col-md-6 px-4">
                  <MyNFTItem data={nft} />
                </div>
              );
            })}
          </div>
        ) : (
          <div>You haven't got any NFTs yet.</div>
        )}
      </div>
    </div>
  );
};

export default MyNFTsWrapper;
