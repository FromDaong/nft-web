import { useEffect, useState } from "react";
import { useWallet } from "use-wallet";
import {
  getTreatMarketplaceContract,
  getOpenOrdersForSeller,
  getResaleOrder,
} from "../treat/utils";
import useTreat from "./useTreat";

const useGetOpenOrdersForSeller = (seller: string = null) => {
  const [orders, setOrders] = useState([]);

  if (seller === null) {
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
