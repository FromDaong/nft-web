import { getCreatorMartContract, mintCreatorNft } from "../treat/utils";

import { useCallback } from "react";
import { useMoralis } from "react-moralis";
import useTreat from "./useTreat";

const useMintCreatorNft = (
  id: number,
  treatCost: number,
  useCreatorMart = false
) => {
  const { account } = useMoralis();
  const treat = useTreat();
  const creatorMartContract = useCreatorMart
    ? getCreatorMartContract(treat)
    : getCreatorMartContract(treat);

  const handleMintCreatorNft = useCallback(async () => {
    const txHash = await mintCreatorNft(
      creatorMartContract,
      account,
      id,
      treatCost
    );
    return txHash;
  }, [account, id, treatCost, creatorMartContract]);

  return { onMintCreatorNft: handleMintCreatorNft };
};

export default useMintCreatorNft;
