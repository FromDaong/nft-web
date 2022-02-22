import {
  getSubscriberMartContract,
  mintFreeSubscriberTreat,
} from "../treat/utils";

import { useCallback } from "react";
import useTreat from "./useTreat";
import { useWallet } from "use-wallet";

const useGetFreeSubscriberTreat = (
  id: number,
  treatCost: number,
  useSubscriberMart = false
) => {
  const { account } = useWallet();
  const treat = useTreat();
  const subscriberMartContract = useSubscriberMart
    ? getSubscriberMartContract(treat)
    : getSubscriberMartContract(treat);

  const handleGetFreeSubscriberTreat = useCallback(async () => {
    const txHash = await mintFreeSubscriberTreat(
      subscriberMartContract,
      account,
      id,
      treatCost
    );

    return txHash;
  }, [account, id, treatCost, subscriberMartContract]);

  return { onGetFreeSubscriberTreat: handleGetFreeSubscriberTreat };
};

export default useGetFreeSubscriberTreat;
