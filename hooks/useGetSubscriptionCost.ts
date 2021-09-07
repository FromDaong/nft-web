import BigNumber from "bignumber.js";
import { getTreatSubscriptionContract, getSubCost } from "../treat/utils";

import { Contract } from "web3-eth-contract";
import { useCallback, useEffect, useState } from "react";
import useBlock from "./useBlock";
import useTreat from "./useTreat";
import { useWallet } from "use-wallet";
import bsc from "@binance-chain/bsc-use-wallet";

const useGetSubscriptionCost = (address: string) => {
  const [subscriptionCost, setSubscriptionCost] = useState(new BigNumber(0));
  const { account } = useWallet();
  const treat = useTreat();
  const subscriptionContract = getTreatSubscriptionContract(treat);

  const fetchSubCost = useCallback(async () => {
    const subscriptionCost = await getSubCost(subscriptionContract, id);
    setSubscriptionCost(new BigNumber(subscriptionCost));
  }, [id, treat]);

  useEffect(() => {
    if (treat) {
      fetchSubCost();
    }
  }, [id, treat]);

  return subscriptionCost;
};

export default useGetSubscriptionCost;
