import { useEffect, useState } from "react";
import {
  getTreatMarketplaceContract,
  getOpenOrdersForNft,
  getResaleOrder,
} from "../treat/utils";
import useTreat from "./useTreat";

const useGetOpenOrdersForNft = (nftId: number) => {
  const [orders,setOrders] = useState([]);

  const treat = useTreat();

  const treatMarketplaceContract = getTreatMarketplaceContract(treat);

  useEffect(() => {
    async function fetchOrders() {
      const sellers = await getOpenOrdersForNft(
        treatMarketplaceContract,
        nftId
      );

      const results = []
      for (let i = 0; i < sellers.length; i++) {
        const seller = sellers[i];
        const order = await getResaleOrder(treatMarketplaceContract, nftId, seller);

        results.push(order);
      }

      setOrders(results)
    }

    if (treat) {
      fetchOrders();
    }
  }, [treat, treatMarketplaceContract]);

  return orders;
};

export default useGetOpenOrdersForNft;
