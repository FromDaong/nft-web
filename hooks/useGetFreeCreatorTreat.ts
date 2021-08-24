import { getCreatorMartContract, mintFreeCreatorTreat } from "../treat/utils";

import { Contract } from "web3-eth-contract";
import { useCallback } from "react";
import useTreat from "./useTreat";
import { useWallet } from "use-wallet";
import bsc from "@binance-chain/bsc-use-wallet";

const useGetFreeCreatorTreat = (
  id: number,
  treatCost: number,
  useFreeCreatorTreats: boolean = false
) => {
  const { account } = useWallet();
  const treat = useTreat();
  const creatorMartContract = useFreeCreatorTreats
    ? getCreatorMartContract(treat)
    : getCreatorMartContract(treat);

  const handleGetFreeCreatorTreat = useCallback(async () => {
    const txHash = await mintFreeCreatorTreat(
      creatorMartContract,
      account,
      id,
      treatCost
    );
    console.log(txHash);
    return txHash;
  }, [account, id, treatCost, creatorMartContract]);

  return { onGetFreeCreatorTreat: handleGetFreeCreatorTreat };
};

export default useGetFreeCreatorTreat;
