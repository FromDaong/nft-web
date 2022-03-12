import { getTreatSubscriptionContract, isSubscribed } from "../treat/utils";
import { useCallback, useEffect, useState } from "react";
import useTreat from "./useTreat";
import { useWallet } from "use-wallet";

const useGetIsSubscribed = (creatorAddress: string) => {
  const { account } = useMoralis();
  const treat = useTreat();
  const treatSubscriptionContract = getTreatSubscriptionContract(treat);
  const [isSubscribedState, setIsSubscribed] = useState(false);

  const handleGetIsSubscribed = useCallback(async () => {
    const s = await isSubscribed(
      treatSubscriptionContract,
      account,
      creatorAddress
    );

    setIsSubscribed(s);
  }, [account, treatSubscriptionContract]);

  useEffect(() => {
    if (treat) {
      handleGetIsSubscribed();
    }
  }, [creatorAddress, treat]);
  return isSubscribedState;
};

export default useGetIsSubscribed;
