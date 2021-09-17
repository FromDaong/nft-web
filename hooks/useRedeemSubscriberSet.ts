import { getSubscriberMartContract, redeemSubscriberSet } from "../treat/utils";
import { useCallback } from "react";
import useTreat from "./useTreat";
import { useWallet } from "use-wallet";

const useRedeemSubscriberSet = (id: number, treatCost: number) => {
  const { account } = useWallet();
  const treat = useTreat();
  const subscriberMartContract = getSubscriberMartContract(treat);

  const handleRedeemSubscriberSet = useCallback(async () => {
    const txHash = await redeemSubscriberSet(
      subscriberMartContract,
      account,
      id,
      treatCost
    );
    console.log(txHash);
    return txHash;
  }, [account, id, treatCost, subscriberMartContract]);

  return { onRedeemSubscriberSet: handleRedeemSubscriberSet };
};

export default useRedeemSubscriberSet;
