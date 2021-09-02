import { getTreatSubscriptionContract, isSubscribed } from "../treat/utils";
import { useCallback } from "react";
import useTreat from "./useTreat";
import { useWallet } from "use-wallet";

const useGetIsSubscribed = () => {
  const { account } = useWallet();
  const treat = useTreat();
  const treatSubscriptionContract = getTreatSubscriptionContract(treat);

  const handleGetIsSubscribed = useCallback(async () => {
    const txHash = await isSubscribed(
        treatSubscriptionContract,
      account
    );
    console.log(txHash);
    return txHash;
  }, [account, treatSubscriptionContract]);

  return { onGetIsSubscribed: handleGetIsSubscribed };
};

export default useGetIsSubscribed;
