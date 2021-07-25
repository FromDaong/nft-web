import useSWR from "swr";
import BigNumber from "bignumber.js";
import Button from "react-bootstrap/Button";
import { getDisplayBalance } from "../../utils/formatBalance";
import React, { useState, useEffect } from "react";
import useCancelOrder from "../../hooks/useCancelOrder";
import usePurchaseOrder from "../../hooks/usePurchaseOrder";
import useGetRemainingOrderBalance from "../../hooks/useGetRemainingOrderBalance";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";

export const Order = ({ order, account, nftResult }) => {
  if (!nftResult) {
    const res = useSWR(`/api/nft/${order.nftId}`);
    nftResult = res.data;
  }

  const [modelData, setModelData] = useState();
  const [nftData, setNftData] = useState();

  // const { status } = useWallet();   // need this for spinners?

  function getModelUsername(modelHandle) {
    // TODO: going forward, we should have all of the model handles use @{name}
    // but to be safe, let's trim any leading '@' signs here first
    //
    // also need to figure out how this would work when we're hands off
    // and not creating NFTs for them

    if (modelHandle && modelHandle[0] === "@") {
      return modelHandle.slice(1);
    }

    return modelHandle;
  }

  useEffect(() => {
    (async () => {
      if (nftResult) {
        setNftData(nftResult);

        const username = getModelUsername(nftResult.model_handle);
        const model = await fetch(`/api/model/${username}`);
        const json = await model.json();
        setModelData(json);
      }
    })();
  }, [nftResult]);

  const [remainingBalance] = useGetRemainingOrderBalance(
    order?.seller,
    order?.nftId
  );

  const { onCancelOrder } = useCancelOrder(order?.nftId);
  const { onPurchaseOrder } = usePurchaseOrder(
    order?.nftId,
    order?.quantity,
    order?.price,
    order?.seller
  );

  function zeroPad(num) {
    return num < 10 ? `0${num}` : num;
  }
  const maxUnixTimestamp = 2147483647000;
  function formatDate(unixSeconds) {
    const date = new Date(parseInt(unixSeconds * 1000));
    return `${date.getFullYear()}-${zeroPad(date.getMonth())}-${zeroPad(
      date.getDay()
    )} at ${zeroPad(date.getHours())}:${zeroPad(date.getMinutes())}`;
  }

  return (
    <>
      {!!order ? (
        <tr style={{ border: "0px solid black" }}>
          <td style={{ border: "0px solid black" }}>
            <a href={`/marketplace/${order.nftId}`}>
              {modelData && (
                <img
                  src={modelData.profile_pic}
                  height="50px"
                  width="50px"
                  title={modelData.username}
                  alt={`${modelData.username} profile pic`}
                />
              )}
            </a>
          </td>
          <td style={{ border: "0px solid black" }}>
            {/* {formatAddress(order.seller)} */}
            {nftData?.name}
          </td>
          <td style={{ border: "0px solid black" }}>{remainingBalance}</td>
          <td style={{ border: "0px solid black" }}>
            {getDisplayBalance(new BigNumber(order.price))} BNB
          </td>
          <td style={{ border: "0px solid black" }}>
            {formatDate(order.listDate)}
          </td>
          <td style={{ border: "0px solid black" }}>
            {parseInt(order.expiresDate) < maxUnixTimestamp / 1000
              ? formatDate(order.expiresDate)
              : "---"}
          </td>
          <td styld={{ border: "0px solid black" }}>
            <Button onClick={() => onPurchaseOrder()}>Buy</Button>
          </td>
          {!!account && account.toUpperCase() === order.seller.toUpperCase() && (
            <td style={{ border: "0px solid black" }}>
              <Button onClick={() => onCancelOrder()}>[X]</Button>
            </td>
          )}
        </tr>
      ) : (
        // TODO: this should probably just be a loading spinner
        <tr>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
      )}
    </>
  );
};

export const MarketplaceList = ({ orderBook, displayId, account }) => {
  return (
    <div className="container fluid">
      <div className="row">
        <div className="nftForSale col-md-4">
          <Button>Buy Now</Button>
        </div>

        <div className="orderbook col-md-7">
          <h1>Morning Wood</h1>
          <div className="row">
            <div className="col">1.05 BNB</div>
            <div className="col">80%</div>
          </div>
          <div className="row">
            <div className="col">
              <img src="#" width="10px" height="20px"></img>
            </div>
            <div className="col">Model Name</div>
            <div className="row">
              <div className="nftBio col">
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Iure,
                  asperiores.
                </p>
              </div>
            </div>
            <Tabs defaultActiveKey="profile" id="uncontrolled-tab-example">
              <Tab eventKey="home" title="Details">
                <p className="orderbook">
                  {" "}
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Doloremque repudiandae labore quisquam totam fugit,
                  accusantium nostrum sequi ut illo nobis?{" "}
                </p>
              </Tab>
              <Tab eventKey="profile" title="Orders">
                <div className="row">
                  <div className="orderbook nftResales col">
                    {orderBook.length > 0 ? (
                      orderBook.map((o) => (
                        <Order
                          order={o}
                          account={account}
                          //   nftId={o.nftId}
                          //   seller={o.seller}
                          key={`${o.nftId}_${o.seller}`}
                        />
                      ))
                    ) : (
                      <div>None for sale.</div>
                    )}
                  </div>
                </div>
              </Tab>
              <Tab eventKey="contact" title="History">
                <p className="orderbook">
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                  Autem, ipsum assumenda aliquid et quod libero accusantium quia
                  earum officiis consequuntur.
                </p>
              </Tab>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};
