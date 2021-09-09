import BigNumber from "bignumber.js";
import { getTreatSubscriptionContract, getSubCost } from "../treat/utils";
import { useCallback, useEffect, useState } from "react";
import useTreat from "./useTreat";
import { useWallet } from "use-wallet";
import { getBalanceNumber } from "../utils/formatBalance";

const useGetSubscriptionCost = (address: string) => {
  const [subscriptionCost, setSubscriptionCost] = useState(new BigNumber(0));
  const { account } = useWallet();
  const treat = useTreat();
  const subscriptionContract = getTreatSubscriptionContract(treat);

  const fetchSubCost = useCallback(async () => {
    const subscriptionCost = await getSubCost(subscriptionContract, address);
    console.log({ subcriptionCostInitial: getBalanceNumber(subscriptionCost) });
    setSubscriptionCost(new BigNumber(subscriptionCost));
  }, [address, treat]);

  useEffect(() => {
    if (treat) {
      fetchSubCost();
    }
  }, [address, treat]);

  return subscriptionCost;
};

export default useGetSubscriptionCost;
