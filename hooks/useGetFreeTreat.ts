import { getFreeTreatsContract, mintFreeTreat } from "../treat/utils";

import { Contract } from "web3-eth-contract";
import { useCallback } from "react";
import useTreat from "./useTreat";
import { useWallet } from "use-wallet";
import bsc from "@binance-chain/bsc-use-wallet";

const useGetFreeTreat = (id: number, treatCost: number, useFreeTreats: boolean = false) => {
  const { account } = useWallet();
  const treat = useTreat();
  const freeTreatsContract = useFreeTreats
    ? getFreeTreatsContract(treat)
    : getFreeTreatsContract(treat);

  const handleGetFreeTreat = useCallback(async () => {
    const txHash = await mintFreeTreat(freeTreatsContract, account, id, treatCost);
    console.log(txHash);
    return txHash;
  }, [account, id, treatCost, freeTreatsContract]);

  return { onMintNft: handleGetFreeTreat };
};

export default useGetFreeTreat;
