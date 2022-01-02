import { getCreatorMartContract, redeemCreatorSet } from "../treat/utils";
import { useCallback } from "react";
import useTreat from "./useTreat";
import { useWallet } from "use-wallet";

const useRedeemCreatorSet = (id: number, treatCost: number) => {
  const { account } = useWallet();
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
