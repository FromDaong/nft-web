import {
  getOpenOrdersForSeller,
  getResaleOrder,
  getTreatMarketplaceContract,
} from "../packages/treat/utils";
import { useEffect, useState } from "react";

import { useMoralis } from "react-moralis";
import useTreat from "./useTreat";

const useGetOpenOrdersForSeller = (seller: string = null) => {
  const [orders, setOrders] = useState([]);

  if (seller === null) {
    const { account } = useMoralis();
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

      const openOrdersForSeller = await Promise.all(
        nfts.map((nftId) =>
          getResaleOrder(treatMarketplaceContract, nftId, seller)
        )
      );

      setOrders(openOrdersForSeller);
    }

    if (treat) {
      fetchOrders();
    }
  }, []);

  return orders;
};

export default useGetOpenOrdersForSeller;
