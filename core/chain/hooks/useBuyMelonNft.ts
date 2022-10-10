import {
  buyMelonNft,
  getMelonMartContract,
} from "../../../packages/treat/utils";

import { useCallback } from "react";
import { useMoralis } from "react-moralis";
import useTreat from "./useTreat";

const useBuyMelonNft = () => {
  const { account } = useMoralis();
  const treat = useTreat();
  const melonMartContract = getMelonMartContract(treat);

  const handleBuyMelonNft = useCallback(async () => {
    const txHash = await buyMelonNft(melonMartContract, account);
    return txHash;
  }, [account, melonMartContract]);

  return { onBuyMelonNft: handleBuyMelonNft };
};

export default useBuyMelonNft;
