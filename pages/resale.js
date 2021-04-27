import BigNumber from 'bignumber.js';
import Button from "react-bootstrap/Button";
import { getDisplayBalance } from '../utils/formatBalance';
import formatAddress from '../utils/formatAddress';
import React from "react";
import useCancelOrder from '../hooks/useCancelOrder'
import usePurchaseOrder from '../hooks/usePurchaseOrder'
import useGetAllOpenOrders from "../hooks/useGetAllOpenOrders";
import useGetResaleOrder from "../hooks/useGetResaleOrder";
import useGetRemainingOrderBalance from '../hooks/useGetRemainingOrderBalance'
import useGetMaxIdForSale from "../hooks/useGetMaxIdForSale";

const Resales = () => {
  const maxId = useGetMaxIdForSale();

  const [orderBook] = useGetAllOpenOrders(maxId);

  return (
    <>
      <div>Resale Orders</div>
      <table style={{border: '1px solid black', backgroundColor: 'rgba(230,230,230)', width: '800px'}}>
        <thead style={{border: '1px solid black'}}>
          <th>NFT</th>
          <th>Seller</th>
          <th>Remaining</th>
          <th>Price</th>
          <th>List Date</th>
          <th>Expires</th>
          <th>Purchase</th>
          <th>Cancel</th>
        </thead>
        <tbody>
          {orderBook.map(nftOrders => nftOrders.map(o => <Order nftId={o.nftId} seller={o.seller} key={`${o.nftId}_${o.seller}`} />))}         
        </tbody>
      </table>
    </>
  );
};

const Order = ({ nftId, seller }) => {
  const order = useGetResaleOrder(nftId, seller);
  const [remainingBalance,] = useGetRemainingOrderBalance(seller, nftId)

  const { onCancelOrder } = useCancelOrder(nftId);
  const { onPurchaseOrder } = usePurchaseOrder(nftId, order?.quantity, order?.price, order?.seller);

  function zeroPad(num) {
    return num < 10 ? `0${num}` : num
  }
  function formatDate(unixSeconds) {
    const date = new Date(parseInt(unixSeconds) * 1000)
    return `${date.getFullYear()}-${zeroPad(date.getMonth())}-${zeroPad(date.getDay())} at ${zeroPad(date.getHours())}:${zeroPad(date.getMinutes())}`
  }

  return (
    <>
    {!! order ? (
      <tr style={{border: '1px solid black'}}>
      <td style={{border: '1px solid black'}}>{order.nftId}</td>
      <td style={{border: '1px solid black'}}>{formatAddress(order.seller)}</td>
      <td style={{border: '1px solid black'}}>{remainingBalance}</td>
      <td style={{border: '1px solid black'}}>{getDisplayBalance(new BigNumber(order.price))} BNB</td>
      <td style={{border: '1px solid black'}}>{formatDate(order.listDate)}</td>
      <td style={{border: '1px solid black'}}>{formatDate(order.expiresDate)}</td>
      <td styld={{border: '1px solid black'}}>
        <Button onClick={() => onPurchaseOrder()}>Buy</Button>
      </td>
      <td style={{border: '1px solid black'}}>
      <Button onClick={() => onCancelOrder()}>[X]</Button>
      </td>
      </tr>
    ) : (
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

const ListOrder = () => {
  return (
    <>
    <div>
      <h3>List Order</h3>
      <div>
        
      </div>
    </div>
    </>
  )
}

export default Resales;
