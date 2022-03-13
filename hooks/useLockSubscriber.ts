import { getTreatSubscriptionContract, lockSub } from "../treat/utils";

import { useCallback } from "react";
import { useMoralis } from "react-moralis";
import useTreat from "./useTreat";

const useLockSubscriber = (subAddress: string) => {
  const { account } = useMoralis();
  const treat = useTreat();
  const treatSubscriptionContract = getTreatSubscriptionContract(treat);

  const handleLockSub = useCallback(async () => {
    const txHash = await lockSub(
      treatSubscriptionContract,
      account,
      subAddress
    );
    return txHash;
  }, [account, subAddress, treatSubscriptionContract]);

  return { onLockSub: handleLockSub };
};

export default useLockSubscriber;
