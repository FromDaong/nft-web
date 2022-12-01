import {
  getCreatorMartContract,
  redeemCreatorSet,
} from "../../../packages/treat/utils";

import { useCallback } from "react";
import { useMoralis } from "react-moralis";
import useTreat from "./useTreat";

const useRedeemCreatorSet = (id: number, treatCost: number) => {
  const { account } = useMoralis();
  const treat = useTreat();
  const creatorMartContract = getCreatorMartContract(treat);

  const handleRedeemCreatorSet = useCallback(async () => {
    const txHash = await redeemCreatorSet(
      creatorMartContract,
      account,
      id,
      treatCost
    );

    return txHash;
  }, [account, id, treatCost, creatorMartContract]);

  return { onRedeemCreatorSet: handleRedeemCreatorSet };
};

export default useRedeemCreatorSet;
