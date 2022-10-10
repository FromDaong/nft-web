import {
  getTreatSubscriptionContract,
  unlockSub,
} from "../packages/treat/utils";

import { useCallback } from "react";
import { useMoralis } from "react-moralis";
import useTreat from "./useTreat";

const useUnlockSubscriber = (subAddress: string) => {
  const { account } = useMoralis();
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
