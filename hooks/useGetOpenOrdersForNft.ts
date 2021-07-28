import { useEffect, useState } from "react";
import {
  getTreatMarketplaceContract,
  getOpenOrdersForNft,
  getResaleOrder,
} from "../treat/utils";
import useTreat from "./useTreat";

const useGetOpenOrdersForNft = (nftId: number) => {
  const [orders, setOrders] = useState([]);

  const treat = useTreat();

  const treatMarketplaceContract = getTreatMarketplaceContract(treat);

  useEffect(() => {
    async function fetchOrders() {
      const sellers = await getOpenOrdersForNft(
        treatMarketplaceContract,
        nftId
      );

      const openOrdersForSeller = await Promise.all(
        sellers.map((seller) =>
          getResaleOrder(treatMarketplaceContract, nftId, seller)
        )
      );

      setOrders(openOrdersForSeller);
    }

    if (treat) {
      fetchOrders();
    }
  }, [treat, treatMarketplaceContract]);

  return orders;
};

export default useGetOpenOrdersForNft;
