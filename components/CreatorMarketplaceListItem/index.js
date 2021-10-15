import useSWR from "swr";
import BigNumber from "bignumber.js";
import Spinner from "react-bootstrap/Spinner";
import { getDisplayBalance } from "../../utils/formatBalance";
import NFTListItem from "../NFTListItem";
import { Trash, CartFill } from "react-bootstrap-icons";
import LazyLoad from "react-lazyload";

export const Order = ({
  order,
  account,
  searchFilter,
  setCancelOrderData,
  setPurchaseOrderData,
}) => {
  const data = order;

  const isOwner = !!account && account.toUpperCase() === data.model_bnb_address;

  return (
    <div className="order-container">
      <LazyLoad height={400} offset={400} once>
        {!!order ? (
          <NFTListItem
            data={data}
            isOwner={isOwner}
            price={
              isNaN(order.list_price)
                ? getDisplayBalance(new BigNumber(order.price))
                : order.list_price
            }
            owner={order.seller}
            quantity={order.quantity}
            disableAnimations={true}
            buttonFunction={(e) => {
              e.preventDefault();
              if (!isOwner) setPurchaseOrderData({ nftData: nftResult, order });
              else setCancelOrderData(nftResult);
            }}
          />
        ) : (
          <div
            style={{ minHeight: 500 }}
            className="d-flex justify-content-center align-items-center"
          >
            <Spinner
              animation="border"
              role="status"
              size="xl"
              variant="primary"
            >
              <span className="sr-only">Loading...</span>
            </Spinner>
          </div>
        )}
      </LazyLoad>
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
