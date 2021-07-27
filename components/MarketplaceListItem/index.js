import useSWR from "swr";
import BigNumber from "bignumber.js";
import Spinner from "react-bootstrap/Spinner";
import Button from "react-bootstrap/Button";
import Reacr from "react";
import useCancelOrder from "../../hooks/useCancelOrder";
import usePurchaseOrder from "../../hooks/usePurchaseOrder";
import { getDisplayBalance } from "../../utils/formatBalance";
import useGetRemainingOrderBalance from "../../hooks/useGetRemainingOrderBalance";
import NFTListItem from "../../components/NFTListItem";
import { Trash, CartFill } from "react-bootstrap-icons";

export const Order = ({ order, account, index, searchFilter }) => {
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

  if (
    !nftResult ||
    (!nftResult.attributes[0].value
      .toLowerCase()
      .includes(searchFilter.toLowerCase()) &&
      !nftResult.name.toLowerCase().includes(searchFilter.toLowerCase()))
  )
    return <></>;

  return (
    <div className="col-md-4">
      {!!order && nftResult ? (
        <NFTListItem
          data={nftResult}
          isOwner={isOwner}
          price={getDisplayBalance(new BigNumber(order.price))}
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
    </div>
  );

  // <td style={{ border: "0px solid black" }}>
  //   {formatDate(order.listDate)}
  // </td>
  // <td style={{ border: "0px solid black" }}>
  //   {parseInt(order.expiresDate) < maxUnixTimestamp / 1000
  //     ? formatDate(order.expiresDate)
  //     : "---"}
  // </td>
};
