import { getSubscriberMartContract, mintSubNft } from "../treat/utils";

import { useCallback } from "react";
import { useMoralis } from "react-moralis";
import useTreat from "./useTreat";

const useMintSubscriberNft = (
  id: number,
  treatCost: number,
  useSubscriberMart = false
) => {
  const { account } = useMoralis();
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
    return txHash;
  }, [account, id, treatCost, subscriberMartContract]);

  return { onMintSubscriberNft: handleMintSubscriberNft };
};

export default useMintSubscriberNft;
