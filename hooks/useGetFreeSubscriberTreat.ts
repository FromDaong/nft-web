import {
  getSubscriberMartContract,
  mintFreeSubscriberTreat,
} from "../treat/utils";

import { useCallback } from "react";
import { useMoralis } from "react-moralis";
import useTreat from "./useTreat";

const useGetFreeSubscriberTreat = (
  id: number,
  treatCost: number,
  useSubscriberMart = false
) => {
  const { account } = useMoralis();
  const treat = useTreat();
  const subscriberMartContract = useSubscriberMart
    ? getSubscriberMartContract(treat)
    : getSubscriberMartContract(treat);

  const handleGetFreeSubscriberTreat = useCallback(async () => {
    const txHash = await mintFreeSubscriberTreat(
      subscriberMartContract,
      account,
      id
    );

    return txHash;
  }, [account, id, treatCost, subscriberMartContract]);

  return { onGetFreeSubscriberTreat: handleGetFreeSubscriberTreat };
};

export default useGetFreeSubscriberTreat;
