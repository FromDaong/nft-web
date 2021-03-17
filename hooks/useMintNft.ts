import { getTreatMartContract, mintNft } from "../treat/utils";

import { Contract } from "web3-eth-contract";
import { useCallback } from "react";
import useTreat from "./useTreat";
import { useWallet } from "use-wallet";

const useMintNft = (nftId, useTreatMart: boolean = false) => {
  const { account } = useWallet();
  const treat = useTreat();
  const treatMartContract = useTreatMart
    ? getTreatMartContract(treat)
    : getTreatMartContract(treat);

  const handleMintNft = useCallback(async () => {
    const txHash = await mintNft(treatMartContract, account, nftId);
    console.log(txHash);
    return txHash;
  }, [account, nftId, treatMartContract]);

  return { onMintNft: handleMintNft };
};

export default useMintNft;
