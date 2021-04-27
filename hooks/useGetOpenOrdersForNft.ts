import { useEffect, useState } from "react";
import {
  getTreatMarketplaceContract,
  getOpenOrdersForNft,
  getResaleOrder,
} from "../treat/utils";
import useTreat from "./useTreat";

const useGetOpenOrdersForNft = (nftId: number) => {
  const [orders,] = useState([]);

  const treat = useTreat();

  const treatMarketplaceContract = getTreatMarketplaceContract(treat);

  useEffect(() => {
    async function fetchOrders() {
      const sellers = await getOpenOrdersForNft(
        treatMarketplaceContract,
        nftId
      );

      for (let i = 0; i < sellers; i++) {
        const seller = sellers[i];
        const order = getResaleOrder(treatMarketplaceContract, nftId, seller);

        orders.push(order);
      }
    }

    if (treat) {
      fetchOrders();
    }
  });

  return orders;
};

export default useGetOpenOrdersForNft;
