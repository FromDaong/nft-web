import { getSubscriberMartContract, mintSubNft } from "../treat/utils";

import { Contract } from "web3-eth-contract";
import { useCallback } from "react";
import useTreat from "./useTreat";
import { useWallet } from "use-wallet";
import bsc from "@binance-chain/bsc-use-wallet";

const useMintSubscriberNft = (
  id: number,
  treatCost: number,
  useSubscriberMart: boolean = false
) => {
  const { account } = useWallet();
  const treat = useTreat();
  const subscriberMartContract = useSubscriberMart
    ? getSubscriberMartContract(treat)
    : getSubscriberMartContract(treat);

  const handleMintSubscriberNft = useCallback(async () => {
    const txHash = await mintSubNft(
      subscriberMartContract,
      account,
      id,
      treatCost
    );
    console.log(txHash);
    return txHash;
  }, [account, id, treatCost, subscriberMartContract]);

  return { onMintSubscriberNft: handleMintSubscriberNft };
};

export default useMintSubscriberNft;
