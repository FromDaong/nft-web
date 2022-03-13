import { getSubCost, getTreatSubscriptionContract } from "../treat/utils";
import { useCallback, useEffect, useState } from "react";

import BigNumber from "bignumber.js";
import useTreat from "./useTreat";

const useGetSubscriptionCost = (address: string) => {
  const [subscriptionCost, setSubscriptionCost] = useState(new BigNumber(0));
  const treat = useTreat();
  const subscriptionContract = getTreatSubscriptionContract(treat);

  const fetchSubCost = useCallback(async () => {
    const subscriptionCost = await getSubCost(subscriptionContract, address);

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
