import { getTreatSubscriptionContract, editSub } from "../treat/utils";
import { useCallback } from "react";
import useTreat from "./useTreat";
import { useWallet } from "use-wallet";

const useEditSubscription = (amount: number) => {
  const { account } = useWallet();
  const treat = useTreat();
  const treatSubscriptionContract = getTreatSubscriptionContract(treat);

  console.log({ amount });
  const handleEditSubscription = useCallback(async () => {
    const txHash = await editSub(treatSubscriptionContract, account, amount);
    console.log(txHash);
    return txHash;
  }, [account, amount, treatSubscriptionContract]);

  return { onEditSubscription: handleEditSubscription };
};

export default useEditSubscription;
