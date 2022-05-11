import { getCreatorMartContract, mintFreeCreatorTreat } from "../treat/utils";

import BigNumber from "bignumber.js";
import { useCallback } from "react";
import { useMoralis } from "react-moralis";
import useTreat from "./useTreat";

const useGetFreeCreatorTreat = (
  id: number,
  treatCost: number | BigNumber,
  useFreeCreatorTreats = false
) => {
  const { account } = useMoralis();
  const treat = useTreat();
  const creatorMartContract = useFreeCreatorTreats
    ? getCreatorMartContract(treat)
    : getCreatorMartContract(treat);

  const handleGetFreeCreatorTreat = useCallback(async () => {
    const txHash = await mintFreeCreatorTreat(creatorMartContract, account, id);

    return txHash;
  }, [account, id, treatCost, creatorMartContract]);

  return { onGetFreeCreatorTreat: handleGetFreeCreatorTreat };
};

export default useGetFreeCreatorTreat;
