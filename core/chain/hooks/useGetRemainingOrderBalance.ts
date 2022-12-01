import { useEffect, useState } from "react";
import {
  getTreatMarketplaceContract,
  getRemainingBalanceForOrder,
} from "../../../packages/treat/utils";
import useTreat from "./useTreat";

const useGetRemainingOrderBalance = (seller: string, nftId: number) => {
  const [remainingBalance, setRemainingBalance] = useState(0);
  const treat = useTreat();

  const treatMarketplaceContract = getTreatMarketplaceContract(treat);

  useEffect(() => {
    async function fetchBalance() {
      const balance = await getRemainingBalanceForOrder(
        treatMarketplaceContract,
        seller,
        nftId
      );
      setRemainingBalance(balance);
    }

    if (treat) {
      fetchBalance();
    }
  }, [treat, nftId, seller]);

  return [remainingBalance, setRemainingBalance];
};

export default useGetRemainingOrderBalance;
