import { useEffect, useState } from "react";
import {
  getTreatMarketplaceContract,
  getResaleOrder,
  getOpenOrdersForNft,
} from "../treat/utils";
import useTreat from "./useTreat";

const useGetAllOpenOrders = (maxId: number) => {
  const [orderBook, setOrderBook] = useState(null);

  const treat = useTreat();
  const treatMarketplaceContract = getTreatMarketplaceContract(treat);

  useEffect(() => {
    async function fetchAllOrders() {
      const sales = [];
      for (let i = 1; i <= maxId; i++) {
        const sellers = await getOpenOrdersForNft(treatMarketplaceContract, i);
        for (let s = 0; s < sellers.length; s++) {
          const seller = sellers[s];
          const order = await getResaleOrder(
            treatMarketplaceContract,
            i,
            seller
          );
          if (!sales[i]) {
            sales[i] = [];
          }
          if (order) {
            console.log({ order });
            sales[i].push({ ...order, mintId: order.nftId, nftId: i });
          }
        }
      }

      setOrderBook(sales);
    }

    fetchAllOrders();
  }, [treat, maxId]);

  return [orderBook, setOrderBook];
};

export default useGetAllOpenOrders;
