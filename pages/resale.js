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
import Tab from "react-bootstrap/Tab"
import Tabs from "react-bootstrap/Tabs"

import { useState } from "react";

const Resales = () => {
  const maxId = useGetMaxIdForSale();

  const [orderBook] = useGetAllOpenOrders(maxId);

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
        <div className="col">
          Model Name
        </div>
        <div className="row">
          <div className="nftBio col">
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Iure, asperiores.</p>
          </div>
        </div>
        <Tabs defaultActiveKey="profile" id="uncontrolled-tab-example">
  <Tab eventKey="home" title="Details">
    <p className="orderbook"> Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque repudiandae labore quisquam totam fugit, accusantium nostrum sequi ut illo nobis? </p>
  </Tab>
  <Tab eventKey="profile" title="Orders">
  <div className="row">
          <div className="orderbook nftResales col">
          {orderBook.map(nftOrders => nftOrders.map(o => <Order nftId={o.nftId} seller={o.seller} key={`${o.nftId}_${o.seller}`} />))}  
          </div>
  </div>
  </Tab>
  <Tab eventKey="contact" title="History">
  <p className="orderbook">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Autem, ipsum assumenda aliquid et quod libero accusantium quia earum officiis consequuntur.</p>
  </Tab>
</Tabs>
        {/*<div className="row">
          <div className="nftResales col">
          {orderBook.map(nftOrders => nftOrders.map(o => <Order nftId={o.nftId} seller={o.seller} key={`${o.nftId}_${o.seller}`} />))}  
          </div>
  </div> */}

    </div>
    </div>
</div>
    </div>



    /* 
    <di>
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
    </div>
    */
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
      <tr style={{border: '0px solid black'}}>
      <td style={{border: '0px solid black'}}>{order.nftId}</td>
      <td style={{border: '0px solid black'}}>{formatAddress(order.seller)}</td>
      <td style={{border: '0px solid black'}}>{remainingBalance}</td>
      <td style={{border: '0px solid black'}}>{getDisplayBalance(new BigNumber(order.price))} BNB</td>
      <td style={{border: '0px solid black'}}>{formatDate(order.listDate)}</td>
      <td style={{border: '0px solid black'}}>{formatDate(order.expiresDate)}</td>
      <td styld={{border: '0px solid black'}}>
        <Button onClick={() => onPurchaseOrder()}>Buy</Button>
      </td>
      <td style={{border: '0px solid black'}}>
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
