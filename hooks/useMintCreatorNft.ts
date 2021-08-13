import { getCreatorMartContract, mintCreatorNft } from "../treat/utils";

import { Contract } from "web3-eth-contract";
import { useCallback } from "react";
import useTreat from "./useTreat";
import { useWallet } from "use-wallet";
import bsc from "@binance-chain/bsc-use-wallet";

const useMintCreatorNft = (id: number, treatCost: number, useCreatorMart: boolean = false) => {
  const { account } = useWallet();
  const treat = useTreat();
  const creatorMartContract = useCreatorMart
    ? getCreatorMartContract(treat)
    : getCreatorMartContract(treat);

  const handleMintCreatorNft = useCallback(async () => {
    const txHash = await mintCreatorNft(creatorMartContract, account, id, treatCost);
    console.log(txHash);
    return txHash;
  }, [account, id, treatCost, creatorMartContract]);

  return { onMintCreatorNft: handleMintCreatorNft };
};

export default useMintCreatorNft;
