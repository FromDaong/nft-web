import BigNumber from "bignumber.js";
import { useCallback } from "react";
import { useWallet } from "use-wallet";
import { getTreatSubscriptionContract, subscribeTo } from "../treat/utils";
import useTreat from "./useTreat";

const useSubscribe = (
  creatorAddress: string,
  totalSubUnits: number,
  subPrice: number
) => {
  const { account } = useWallet();
  const treat = useTreat();

  const treatSubscriptionContract = getTreatSubscriptionContract(treat);

  const totalPrice = new BigNumber(totalSubUnits).multipliedBy(new BigNumber(subPrice));

  const handleSubscribe = useCallback(async () => {
    const txHash = await subscribeTo(
      treatSubscriptionContract,
      account,
      creatorAddress,
      Number(totalPrice),
      totalSubUnits
    );

    return txHash;
  }, [account, creatorAddress, totalPrice, totalSubUnits, treatSubscriptionContract]);

  return { onSubscribe: handleSubscribe };
};

export default useSubscribe;
