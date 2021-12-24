import { getMelonMartContract, buyMelonNft } from "../treat/utils";

import { Contract } from "web3-eth-contract";
import { useCallback } from "react";
import useTreat from "./useTreat";
import { useWallet } from "use-wallet";
import bsc from "@binance-chain/bsc-use-wallet";

const useBuyMelonNft = () => {
  const { account } = useWallet();
  const treat = useTreat();
  const melonMartContract = getMelonMartContract(treat);

  const handleBuyMelonNft = useCallback(async () => {
    const txHash = await buyMelonNft(melonMartContract, account);
    return txHash;
  }, [account, melonMartContract]);

  return { onBuyMelonNft: handleBuyMelonNft };
};

export default useBuyMelonNft;
