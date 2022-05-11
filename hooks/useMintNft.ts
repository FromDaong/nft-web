import { getTreatMartContract, mintNft } from "../treat/utils";

import BigNumber from "bignumber.js";
import { useCallback } from "react";
import { useMoralis } from "react-moralis";
import useTreat from "./useTreat";

const useMintNft = (
  id: number,
  treatCost: number | BigNumber,
  useTreatMart = false
) => {
  const { account } = useMoralis();
  const treat = useTreat();
  const treatMartContract = useTreatMart
    ? getTreatMartContract(treat)
    : getTreatMartContract(treat);

  const handleMintNft = useCallback(async () => {
    const txHash = await mintNft(treatMartContract, account, id, treatCost);
    return txHash;
  }, [account, id, treatCost, treatMartContract]);

  return { onMintNft: handleMintNft };
};

export default useMintNft;
