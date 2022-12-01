import {
  getSubCost,
  getTreatSubscriptionContract,
} from "../../../packages/treat/utils";
import { useCallback, useEffect, useState } from "react";

import BigNumber from "bignumber.js";
import useTreat from "./useTreat";

const useGetSubscriptionCost = (address: string) => {
  const [subscriptionCost, setSubscriptionCost] = useState(BigNumber.from(0));
  const treat = useTreat();
  const subscriptionContract = getTreatSubscriptionContract(treat);

  const fetchSubCost = useCallback(async () => {
    const subscriptionCost = await getSubCost(subscriptionContract, address);

    setSubscriptionCost(BigNumber.from(subscriptionCost));
  }, [address, treat]);

  useEffect(() => {
    if (treat) {
      fetchSubCost();
    }
  }, [address, treat]);

  return subscriptionCost;
};

export default useGetSubscriptionCost;
