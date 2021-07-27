import useSWR from "swr";
import BigNumber from "bignumber.js";
import Spinner from "react-bootstrap/Spinner";
import Button from "react-bootstrap/Button";
import { getDisplayBalance } from "../../utils/formatBalance";
import React, { useState, useEffect } from "react";
import useCancelOrder from "../../hooks/useCancelOrder";
import usePurchaseOrder from "../../hooks/usePurchaseOrder";
import useGetRemainingOrderBalance from "../../hooks/useGetRemainingOrderBalance";
import NFTListItem from "../../components/NFTListItem";
import { Trash, CartFill } from "react-bootstrap-icons";

export const Order = ({ order, account }) => {
  const { data: nftResult } = useSWR(`/api/nft/${order.nftId}`);

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

  const isOwner =
    !!account && account.toUpperCase() === order.seller.toUpperCase();

  return (
    <>
      {!!order && nftResult ? (
        <>
          <NFTListItem
            data={nftResult}
            isOwner={isOwner}
            price={order.price}
            owner={order.seller}
            buttonLabel={
              isOwner ? (
                <>
                  <Trash className="mr-2" />
                  Remove Your Listing
                </>
              ) : (
                <>
                  <CartFill className="mr-2" />
                  Purchase
                </>
              )
            }
            buttonFunction={(e) => {
              e.preventDefault();
              !isOwner ? onPurchaseOrder() : onCancelOrder();
            }}
          />
        </>
      ) : (
        <div
          style={{ minHeight: 500 }}
          className="d-flex justify-content-center align-items-center"
        >
          <Spinner animation="border" role="status" size="xl" variant="primary">
            <span className="sr-only">Loading...</span>
          </Spinner>
        </div>
      )}
    </>
  );

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
        <div>Loading...</div>
      )}
    </>
  );
};
