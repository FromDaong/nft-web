import { useEffect, useState } from "react";
import { useWallet } from "use-wallet";
import {
  getTreatMarketplaceContract,
  getOpenOrdersForSeller,
  getResaleOrder,
} from "../treat/utils";
import useTreat from "./useTreat";

const useGetOpenOrdersForSeller = (seller: string = null) => {
  const [orders,] = useState([]);

  if(seller === null) {
    const { account } = useWallet();
    seller = account;
  }

  const treat = useTreat();

  const treatMarketplaceContract = getTreatMarketplaceContract(treat);

  useEffect(() => {
    async function fetchOrders() {
      const nfts = await getOpenOrdersForSeller(
        treatMarketplaceContract,
        seller
      );

      for (let i = 0; i < nfts; i++) {
        const nftId = nfts[i];
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

export default useGetOpenOrdersForSeller;
