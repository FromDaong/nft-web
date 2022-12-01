import {
  addSubscriberFreeTreat,
  getSubscriberMartContract,
} from "../../../packages/treat/utils";

import { useCallback } from "react";
import { useMoralis } from "react-moralis";
import useTreat from "./useTreat";

const useAddSubscriberFreeTreat = (ids: Array<number>) => {
  const { account } = useMoralis();
  const treat = useTreat();
  const subscriberMartContract = getSubscriberMartContract(treat);

  const handleAddSubscriberFreeTreat = useCallback(async () => {
    const txHash = await addSubscriberFreeTreat(
      subscriberMartContract,
      account,
      ids
    );
    return txHash;
  }, [account, ids, subscriberMartContract]);

  return { onAddSubscriberFreeTreat: handleAddSubscriberFreeTreat };
};

export default useAddSubscriberFreeTreat;
