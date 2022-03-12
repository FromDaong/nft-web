import { getTreatSubscriptionContract, editSub } from "../treat/utils";
import { useCallback } from "react";
import useTreat from "./useTreat";
import { useWallet } from "use-wallet";

const useEditSubscription = (amount: number) => {
  const { account } = useMoralis();
  const treat = useTreat();
  const treatSubscriptionContract = getTreatSubscriptionContract(treat);

  const handleEditSubscription = useCallback(async () => {
    const txHash = await editSub(treatSubscriptionContract, account, amount);

    return txHash;
  }, [account, amount, treatSubscriptionContract]);

  return { onEditSubscription: handleEditSubscription };
};

export default useEditSubscription;
