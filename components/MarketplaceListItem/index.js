import useSWR from "swr";
import BigNumber from "bignumber.js";
import Spinner from "react-bootstrap/Spinner";
import { getDisplayBalance } from "../../utils/formatBalance";
import NFTListItem from "../../components/NFTListItem";
import { Trash, CartFill } from "react-bootstrap-icons";
import LazyLoad from "react-lazyload";

export const Order = ({
  order,
  account,
  searchFilter,
  setCancelOrderData,
  setPurchaseOrderData,
  nftResult,
}) => {
  // const { data: nftResult } = useSWR(`/api/nft/${order.nftId}`);

  const isOwner =
    !!account &&
    account.toUpperCase() === order.model_bnb_address.toUpperCase();

  if (!nftResult) return <></>;

  return (
    <div className="col-md-4">
      <LazyLoad height={400} offset={400} once>
        {!!order && nftResult ? (
          <NFTListItem
            data={nftResult}
            isOwner={isOwner}
            price={getDisplayBalance(new BigNumber(order.price))}
            owner={order.seller}
            quantity={order.quantity}
            disableAnimations={true}
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
