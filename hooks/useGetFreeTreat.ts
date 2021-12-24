import { getTreatMartContract, mintFreeTreat } from "../treat/utils";

import { Contract } from "web3-eth-contract";
import { useCallback } from "react";
import useTreat from "./useTreat";
import { useWallet } from "use-wallet";
import bsc from "@binance-chain/bsc-use-wallet";

const useGetFreeTreat = (
  id: number,
  treatCost: number,
  useFreeTreats: boolean = false
) => {
  const { account } = useWallet();
  const treat = useTreat();
  const treatMartContract = useFreeTreats
    ? getTreatMartContract(treat)
    : getTreatMartContract(treat);

  const handleGetFreeTreat = useCallback(async () => {
    const txHash = await mintFreeTreat(
      treatMartContract,
      account,
      id,
      treatCost
    );

    return txHash;
  }, [account, id, treatCost, treatMartContract]);

  return { onGetFreeTreat: handleGetFreeTreat };
};

export default useGetFreeTreat;
