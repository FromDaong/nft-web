import { getTreatSubscriptionContract, unlockSub } from "../treat/utils";
import { useCallback } from "react";
import useTreat from "./useTreat";
import { useWallet } from "use-wallet";

const useUnlockSubscriber = (subAddress: string) => {
  const { account } = useWallet();
  const treat = useTreat();
  const treatSubscriptionContract = getTreatSubscriptionContract(treat);

  const handleUnlockSub = useCallback(async () => {
    const txHash = await unlockSub(
      treatSubscriptionContract,
      account,
      subAddress
    );
    return txHash;
  }, [account, subAddress, treatSubscriptionContract]);

  return { onUnlockSub: handleUnlockSub };
};

export default useUnlockSubscriber;
