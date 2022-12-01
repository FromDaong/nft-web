import {
  getTreatSubscriptionContract,
  subscribeTo,
} from "../../../packages/treat/utils";

import BigNumber from "bignumber.js";
import { useCallback } from "react";
import { useMoralis } from "react-moralis";
import useTreat from "./useTreat";

const useSubscribe = (
  creatorAddress: string,
  totalSubUnits: number,
  subPrice: number
) => {
  const { account } = useMoralis();
  const treat = useTreat();

  const treatSubscriptionContract = getTreatSubscriptionContract(treat);

  const totalPrice = BigNumber.from(totalSubUnits).multipliedBy(
    BigNumber.from(subPrice)
  );

  const handleSubscribe = useCallback(async () => {
    const txHash = await subscribeTo(
      treatSubscriptionContract,
      account,
      creatorAddress,
      Number(totalPrice),
      totalSubUnits
    );

    return txHash;
  }, [
    account,
    creatorAddress,
    totalPrice,
    totalSubUnits,
    treatSubscriptionContract,
  ]);

  return { onSubscribe: handleSubscribe };
};

export default useSubscribe;
