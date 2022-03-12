import { getSubscriberMartContract, addSubscriberNft } from "../treat/utils";
import { useCallback } from "react";
import useTreat from "./useTreat";
import { useMoralis } from "react-moralis";

const useAddSubscriberNFTs = (ids: Array<number>, amounts: Array<number>) => {
  const { account } = useMoralis();
  const treat = useTreat();
  const subscriberMartContract = getSubscriberMartContract(treat);

  const handleAddSubscriberNFTs = useCallback(async () => {
    const txHash = await addSubscriberNft(
      subscriberMartContract,
      account,
      ids,
      amounts
    );

    return txHash;
  }, [account, ids, amounts, subscriberMartContract]);

  return { onAddSubscriberNFTs: handleAddSubscriberNFTs };
};

export default useAddSubscriberNFTs;
