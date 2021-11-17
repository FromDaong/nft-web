import { getMelonMartContract, buyMelonNft } from "../treat/utils";

import { Contract } from "web3-eth-contract";
import { useCallback } from "react";
import useTreat from "./useTreat";
import { useWallet } from "use-wallet";
import bsc from "@binance-chain/bsc-use-wallet";

const useBuyMelonNft = (
  id: number,
  treatCost: number,
  useMelonMart: boolean = false
) => {
  const { account } = useWallet();
  const treat = useTreat();
  const melonMartContract = useMelonMart
    ? getMelonMartContract(treat)
    : getMelonMartContract(treat);

  const handleMintNft = useCallback(async () => {
    const txHash = await mintNft(melonMartContract, account, id, treatCost);
    console.log(txHash);
    return txHash;
  }, [account, id, treatCost, melonMartContract]);

  return { onBuyMelonNft: handleBuyMelonNft };
};

export default useBuyMelonNft;
