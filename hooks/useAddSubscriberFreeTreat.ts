import {
  getSubscriberMartContract,
  addSubscriberFreeTreat,
} from "../treat/utils";
import { useCallback } from "react";
import useTreat from "./useTreat";
import { useWallet } from "use-wallet";

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
