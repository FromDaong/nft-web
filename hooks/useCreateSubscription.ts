import { getTreatSubscriptionContract, createSub } from "../treat/utils";
import { useCallback } from "react";
import useTreat from "./useTreat";
import { useWallet } from "use-wallet";

const useCreateSubscription = (amount: number) => {
  const { account } = useWallet();
  const treat = useTreat();
  const treatSubscriptionContract = getTreatSubscriptionContract(treat);

  const handleCreateSubscription = useCallback(async () => {
    const txHash = await createSub(treatSubscriptionContract, account, amount);
    console.log(txHash);
    return txHash;
  }, [account, amount, treatSubscriptionContract]);

  return { onCreateSubscription: handleCreateSubscription };
};

export default useCreateSubscription;
