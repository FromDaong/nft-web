import { getTreatMartContract, mintNft } from "../treat/utils";

import { Contract } from "web3-eth-contract";
import { useCallback } from "react";
import useTreat from "./useTreat";
import { useWallet } from "use-wallet";
import bsc from "@binance-chain/bsc-use-wallet";

const useMintNft = (id: number, treatCost: number, useTreatMart = false) => {
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
